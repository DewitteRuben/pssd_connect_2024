import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useUnitDistance } from "../utils/math";

type DistanceSliderProps = {
  max: number;
  onChange?: (max: number) => void;
};

const DistanceSlider: React.FC<DistanceSliderProps> = ({ max: defaultMax, onChange }) => {
  const [max, setMax] = React.useState(defaultMax);
  const distanceWithUnit = useUnitDistance(max);

  const onAgeChange = (value: number[]) => {
    setMax(value[0]);
  };

  const onAgeChangeEnd = (value: number[]) => {
    if (onChange) {
      onChange(value[0]);
    }
  };

  return (
    <>
      <RangeSlider
        aria-label={["min", "max"]}
        min={0}
        minStepsBetweenThumbs={1}
        onChange={onAgeChange}
        onChangeEnd={onAgeChangeEnd}
        max={400}
        defaultValue={[defaultMax]}
      >
        <RangeSliderTrack>
          <RangeSliderFilledTrack />
        </RangeSliderTrack>
        <RangeSliderThumb index={0}></RangeSliderThumb>
      </RangeSlider>
      <Text>{distanceWithUnit}</Text>
    </>
  );
};

export default DistanceSlider;
