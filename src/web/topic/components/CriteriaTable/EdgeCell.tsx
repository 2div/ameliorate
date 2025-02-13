import { openContextMenu } from "@/web/common/store/contextMenuActions";
import { CommonIndicators } from "@/web/topic/components/Indicator/CommonIndicators";
import { ContentIndicators } from "@/web/topic/components/Indicator/ContentIndicators";
import { StatusIndicators } from "@/web/topic/components/Indicator/StatusIndicators";
import { Edge } from "@/web/topic/utils/graph";
import { setSelected, useIsGraphPartSelected } from "@/web/view/selectedPartStore";

export const EdgeCell = ({ edge }: { edge: Edge }) => {
  const selected = useIsGraphPartSelected(edge.id);

  return (
    <div
      className={
        "flex h-full flex-col items-center justify-center" +
        // bg-neutral-50 instead of bg-neutral-main because we specifically want to contrast with indicator backgrounds
        ` hover:bg-neutral-50${selected ? " bg-neutral-50" : ""}`
      }
      onClick={() => setSelected(edge.id)}
      onContextMenu={(event) => openContextMenu(event, { edge })}
      role="button"
    >
      <CommonIndicators graphPart={edge} />
      <div className="flex">
        <StatusIndicators
          graphPartId={edge.id}
          color="paperPlain"
          notes={edge.data.notes}
          className="my-0 ml-0"
        />
        <ContentIndicators
          className="m-0"
          graphPartId={edge.id}
          graphPartType="edge"
          color="paperPlain"
        />
      </div>
    </div>
  );
};
