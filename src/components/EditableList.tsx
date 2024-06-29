import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton, Input } from "@chakra-ui/react";
import { Checkbox } from "@chakra-ui/react";
import React from "react";

type EditableListProps = {
  items?: string[];
  presetItems?: string[];
  onChange?: (items: string[]) => void;
};

const EditableList: React.FC<EditableListProps> = ({
  presetItems,
  onChange,
  items: initialItems = [],
}) => {
  const [items, setItems] = React.useState(
    (presetItems ?? []).map((presetItem, index) => ({
      id: index,
      name: presetItem,
      checked: initialItems.includes(presetItem),
      custom: false,
    }))
  );

  const [symptom, setSymptom] = React.useState("");

  const handleOnInputChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    setSymptom(ev.target.value);
  };

  const onAddSymptom = () => {
    const lastItem = items[items.length - 1];
    const newItems = [
      ...items.slice(0),
      {
        id: lastItem?.id ? lastItem?.id + 1 : 0,
        checked: true,
        name: symptom,
        custom: true,
      },
    ];

    setItems(newItems);
  };

  const onDeleteSymptom = (id: number) => () => {
    setItems((items) => items.filter((i) => i.id !== id));
  };

  const handleOnCheckedChange = (id: number) => () => {
    const currentCheckboxIndex = items.findIndex((item) => item.id === id);

    const updatedItem = {
      ...items[currentCheckboxIndex],
      checked: !items[currentCheckboxIndex].checked,
    };

    const newItems = [
      ...items.slice(0, currentCheckboxIndex),
      updatedItem,
      ...items.slice(currentCheckboxIndex + 1),
    ];

    setItems(newItems);
  };

  React.useEffect(() => {
    if (onChange) {
      onChange(items.filter((item) => item.checked).map((item) => item.name));
    }
  }, [items]);

  return (
    <Box>
      {items.map((item) => (
        <Box key={item.id}>
          <Checkbox onChange={handleOnCheckedChange(item.id)} isChecked={item.checked}>
            {item.name}
          </Checkbox>
          {item.custom && (
            <IconButton
              marginLeft={4}
              size="xs"
              onClick={onDeleteSymptom(item.id)}
              aria-label="Remove symptom"
              icon={<DeleteIcon />}
            />
          )}
        </Box>
      ))}
      <Box marginY={4} display="flex" alignItems="center">
        <Input
          onChange={handleOnInputChange}
          value={symptom}
          placeholder="Enter another item..."
          width="70%"
          size="xs"
        />
        <IconButton
          marginLeft={4}
          isDisabled={!symptom.length || !!items.find((i) => i.name === symptom)}
          size="xs"
          onClick={onAddSymptom}
          aria-label="Add symptom"
          icon={<AddIcon />}
        />
      </Box>
    </Box>
  );
};

export default EditableList;
