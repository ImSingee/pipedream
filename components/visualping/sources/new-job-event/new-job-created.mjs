import visualping from "../../app/visualping.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Job Event",
  version: "0.0.1",
  key: "visualping-new-job-event",
  description: "Emit a new event for each new job event.",
  type: "source",
  dedupe: "unique",
  props: {
    visualping,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    jobId: {
      propDefinition: [
        visualping,
        "jobId",
      ],
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.process_id,
        summary: `New event with ID ${data.process_id}`,
        ts: Date.parse(data.process_created),
      });
    },
  },
  async run() {
    const { history: events } = await this.visualping.getJob({
      jobId: this.jobId,
    });

    events.reverse().forEach(this.emitEvent);
  },
};
