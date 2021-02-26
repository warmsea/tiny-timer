import { TextField, withStyles } from "@material-ui/core";
import React, { useCallback } from "react";

const StyledTextField = withStyles({
  root: {
    margin: "16px 4px",
  },
})(TextField);

export interface INumberInputProps {
  id: string;
  label: string;
  max: number;
  onValueChange?: (value: number) => void;
}

export function NumberInput(props: INumberInputProps): JSX.Element {
  let value = 0;

  const onFocus = useCallback((event) => {
    event.target.select();
  }, []);
  const onChange = useCallback((event) => {
    let newValue;
    if (event.target.value == "") {
      newValue = 0;
    } else if (/^[0-9]{1,2}$/.test(event.target.value)) {
      newValue = parseInt(event.target.value);
      if (newValue > props.max) {
        newValue = props.max;
      }
    } else {
      newValue = value;
    }
    event.target.value = newValue;
    if (newValue !== value) {
      value = newValue;
      props.onValueChange?.(value);
    }
  }, []);

  return (
    <StyledTextField
      type="number"
      id={props.id}
      label={props.label}
      variant="outlined"
      size="small"
      inputProps={{ min: 0, max: props.max, step: 1 }}
      defaultValue={value}
      onFocus={onFocus}
      onChange={onChange}
    />
  );
}
