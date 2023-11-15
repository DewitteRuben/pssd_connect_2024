import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
} from "@chakra-ui/react";
import React from "react";

type AgeRangeSliderProps = {
  start: number;
  end: number;
  onChange?: (payload: { min: number; max: number }) => void;
};

const AgeRangeSlider: React.FC<AgeRangeSliderProps> = ({
  start: defaultMin,
  end: defaultMax,
  onChange,
}) => {
  const [min, setMin] = React.useState(defaultMin);
  const [max, setMax] = React.useState(defaultMax);

  const onAgeChange = (value: number[]) => {
    setMin(value[0]);
    setMax(value[1]);
  };

  const onAgeChangeEnd = (value: number[]) => {
    if (onChange) {
      onChange({ min: value[0], max: value[1] });
    }
  };

  return (
    <>
      <RangeSlider
        aria-label={["min", "max"]}
        min={18}
        minStepsBetweenThumbs={1}
        onChange={onAgeChange}
        onChangeEnd={onAgeChangeEnd}
        max={100}
        defaultValue={[defaultMin, defaultMax]}
      >
        <RangeSliderTrack>
          <RangeSliderFilledTrack />
        </RangeSliderTrack>
        <RangeSliderThumb index={0}></RangeSliderThumb>
        <RangeSliderThumb index={1}></RangeSliderThumb>
      </RangeSlider>
      <Text>
        {min} - {max}
      </Text>
    </>
  );
};

export default AgeRangeSlider;
