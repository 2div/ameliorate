import { AutoStories, School, ThumbsUpDown } from "@mui/icons-material";
import { FormControlLabel, Switch as MuiSwitch, Stack, Typography } from "@mui/material";

import { StandardFilter } from "@/web/view/components/Filter/StandardFilter";
import { setShowInformation, useInfoFilter } from "@/web/view/currentViewStore/filter";

export const InformationFilters = () => {
  const diagramFilter = useInfoFilter();

  return (
    // TODO: extract Switch component from FormSwitch
    <Stack spacing={1} paddingX={1}>
      <FormControlLabel
        label={
          <Stack direction="row" spacing={0.5}>
            <Typography>Breakdown</Typography>
            <AutoStories />
          </Stack>
        }
        control={
          <MuiSwitch
            checked={diagramFilter.breakdown.show}
            onChange={(_event, checked) => setShowInformation("breakdown", checked)}
          />
        }
      />
      {diagramFilter.breakdown.show && (
        <StandardFilter infoCategory="breakdown" filter={diagramFilter.breakdown} />
      )}

      <FormControlLabel
        label={
          <Stack direction="row" spacing={0.5}>
            <Typography>Research</Typography>
            <School />
          </Stack>
        }
        control={
          <MuiSwitch
            checked={diagramFilter.research.show}
            onChange={(_event, checked) => setShowInformation("research", checked)}
          />
        }
      />
      {diagramFilter.research.show && (
        <StandardFilter infoCategory="research" filter={diagramFilter.research} />
      )}

      <FormControlLabel
        label={
          <Stack direction="row" spacing={0.5}>
            <Typography>Justification</Typography>
            <ThumbsUpDown />
          </Stack>
        }
        control={
          <MuiSwitch
            checked={diagramFilter.justification.show}
            onChange={(_event, checked) => setShowInformation("justification", checked)}
          />
        }
      />
      {diagramFilter.justification.show && (
        <StandardFilter infoCategory="justification" filter={diagramFilter.justification} />
      )}
    </Stack>
  );
};
