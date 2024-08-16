import { Button } from "@mui/material";
import { StepType } from "@reactour/tour";
import Image from "next/image";

import { celebrateGif } from "@/web/common/urls";
import { NodeTypeText } from "@/web/topic/components/NodeTypeText/NodeTypeText";
import { StepContent } from "@/web/tour/StepContent";
import { startTour } from "@/web/tour/tour";
import { detailsPaneSelector, tourDefaultAnchorClass } from "@/web/tour/tourUtils";

export const addingNuanceSteps: StepType[] = [
  {
    selector: `.${tourDefaultAnchorClass}`,
    content: (
      <StepContent
        stepTitle="Scoring"
        text={
          <span>
            You can use scores to convey positive or negative opinion about nodes and edges.
            <br />
            <br />
            Here we're saying that we think pedestrians getting hit is a big concern, and that
            people getting places faster is a benefit but we don't care about it at all.
          </span>
        }
        imageSlot={
          <Image
            src="https://github.com/user-attachments/assets/47b18abe-cf40-47cf-9b18-f376dfbe7723"
            alt="scoring a node"
            width={434}
            height={328}
            key="https://github.com/user-attachments/assets/47b18abe-cf40-47cf-9b18-f376dfbe7723"
          />
        }
      />
    ),
  },
  {
    selector: `.${tourDefaultAnchorClass}`,
    content: (
      <StepContent
        stepTitle="Perspectives"
        text={
          <span>
            By default, you'll see your own scores, but if you're viewing a topic that others have
            scored too, you can compare scores.
            <br />
            <br />
            You can also go to the More Actions Drawer to choose which perspectives to view.
          </span>
        }
        imageSlot={
          <Image
            src="https://github.com/user-attachments/assets/bdf7fd16-d44a-4a74-8e5e-24cd577dc647"
            alt="viewing other perspectives"
            width={492}
            height={411}
            key="https://github.com/user-attachments/assets/bdf7fd16-d44a-4a74-8e5e-24cd577dc647"
          />
        }
      />
    ),
  },
  {
    selector: detailsPaneSelector,
    content: (
      <StepContent
        stepTitle="Justification"
        text={
          <span>
            You can add <NodeTypeText type="support" /> or <NodeTypeText type="critique" /> nodes to
            justify positive or negative opinions. Details like these can be found on the side, in
            the Details Pane.
            <br />
            <br />
            Here we're supporting that "pedestrians might get hit" is concerning because it reduces
            the feeling of safety in the neighborhood.
          </span>
        }
        imageSlot={
          <Image
            src="https://github.com/user-attachments/assets/4b3f2bcb-9890-4e02-aa33-fea8e8721ea9"
            alt="justifying sentiments"
            width={600}
            height={353}
            key="https://github.com/user-attachments/assets/4b3f2bcb-9890-4e02-aa33-fea8e8721ea9"
          />
        }
      />
    ),
  },
  {
    selector: detailsPaneSelector,
    content: (
      <StepContent
        stepTitle="Research"
        text={
          <span>
            You can add a <NodeTypeText type="question" /> to indicate something that would be good
            to find out, or a <NodeTypeText type="fact" /> or <NodeTypeText type="source" /> to
            point out other relevant information.
            <br />
            <br />
            These can also all be scored, just like any other node, to convey your opinion on them.
          </span>
        }
        imageSlot={
          <Image
            src="https://github.com/user-attachments/assets/9e12369a-c41f-47c9-ba40-ab95f60985d3"
            alt="adding research"
            width={579}
            height={379}
            key="https://github.com/user-attachments/assets/9e12369a-c41f-47c9-ba40-ab95f60985d3"
          />
        }
      />
    ),
  },
  {
    selector: detailsPaneSelector,
    content: (
      <StepContent
        stepTitle="Notes & Comments"
        text={
          <span>
            You can use Notes for any additional info, or Comments to start a discussion about the
            part.
          </span>
        }
        imageSlot={
          <>
            <Image
              src="https://github.com/user-attachments/assets/a1e9b490-2dad-4662-81f2-121524708140"
              alt="note"
              width={377}
              height={140}
              key="https://github.com/user-attachments/assets/a1e9b490-2dad-4662-81f2-121524708140"
              className="mr-3 shadow-lg"
            />
            <Image
              src="https://github.com/user-attachments/assets/e7a9c06c-71f4-4f41-9fc5-d89bf81d60ad"
              alt="comment"
              width={382}
              height={224}
              key="https://github.com/user-attachments/assets/e7a9c06c-71f4-4f41-9fc5-d89bf81d60ad"
              className="ml-3 pt-3 shadow-lg"
            />
          </>
        }
      />
    ),
  },
  {
    selector: `.${tourDefaultAnchorClass}`,
    content: (
      <StepContent
        stepTitle="Indicators"
        text={
          <span>
            There are indicators for each kind of info, so you know at-a-glance where extra details
            are.
          </span>
        }
        imageSlot={
          <Image
            src="https://github.com/user-attachments/assets/5f363814-a2d5-469e-b033-63d7fc0b6cf5"
            alt="indicators"
            width={507}
            height={360}
            key="https://github.com/user-attachments/assets/5f363814-a2d5-469e-b033-63d7fc0b6cf5"
          />
        }
      />
    ),
  },
  {
    selector: `.${tourDefaultAnchorClass}`,
    content: (
      <StepContent
        stepTitle='Completed "Adding nuance"! 🎉'
        text="Let's goooo! Next, learn how to use the criteria table to compare tradeoffs."
        actionSlot={
          <Button disabled variant="contained" onClick={() => startTour("criteriaTable")}>
            Next: Criteria Table (coming soon)
          </Button>
        }
        imageSlot={
          <Image
            src={celebrateGif}
            alt="Celebrate completed tutorial!"
            width={256}
            height={143}
            key={celebrateGif}
          />
        }
      />
    ),
  },
];