import { QuestionMark } from "@mui/icons-material";
import { type ButtonProps } from "@mui/material";
import { useCallback } from "react";

import { Indicator } from "@/web/topic/components/Indicator/Indicator";
import { viewDetails } from "@/web/topic/components/TopicPane/paneStore";
import { useResearchNodes } from "@/web/topic/store/graphPartHooks";
import { useDisplayScores } from "@/web/topic/store/scoreHooks";
import { Score } from "@/web/topic/utils/graph";
import { getNumericScore, scoreColors } from "@/web/topic/utils/score";
import { setSelected } from "@/web/view/currentViewStore/store";

interface Props {
  graphPartId: string;
  partColor: ButtonProps["color"];
}

export const QuestionIndicator = ({ graphPartId, partColor }: Props) => {
  const { questions } = useResearchNodes(graphPartId);
  const scoresByGraphPart = useDisplayScores(questions.map((question) => question.id));

  const onClick = useCallback(() => {
    setSelected(graphPartId);
    viewDetails();
  }, [graphPartId]);

  if (questions.length === 0) return <></>;

  const questionScores = Object.values(scoresByGraphPart).map((score) => getNumericScore(score));
  const highestScore = Math.max(...questionScores);

  // could just color if score is > 5, to avoid bringing attention to unimportant things, but it seems nice to have the visual indication of a low score too
  const scoreColor = scoreColors[highestScore.toString() as Score] as ButtonProps["color"];

  const Icon = QuestionMark;

  return (
    <Indicator
      Icon={Icon}
      title={`Has ${questions.length} questions`}
      onClick={onClick}
      iconHasBackground={false}
      color={scoreColor ?? partColor}
    />
  );
};
