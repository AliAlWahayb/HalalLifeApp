import React, { useState, useReducer, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import { validate } from 'util/Validators';

const inputReducer = (state: any, action: { type: any; val: any; validators: any }) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
        isTouched: true,
      };

    case 'TOUCHED':
      return { ...state, isTouched: true };
    default:
      return state;
  }
};

const InputForm = (props: {
  initialValue?: any;
  initialValid?: any;
  validators?: any;
  label?: any;
  placeholder?: any;
  secureTextEntry?: any;
  errorText?: any;
  id?: any;
  onInput?: any;
}) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false,
  });
  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event: { nativeEvent: { text: any } }) => {
    dispatch({
      type: 'CHANGE',
      val: event.nativeEvent.text,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH',
      val: undefined,
      validators: undefined,
    });
  };

  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className=" mb-4 w-full">
      <Text className="mb-2 text-sm font-semibold text-gray-400">{props.label}</Text>

      <TextInput
        className={`
          rounded-lg border px-4 py-4 
          ${isFocused ? 'border-green-200' : 'border-gray-300'} 
          ${!inputState.isValid && inputState.isTouched ? 'border-red-500' : 'border-gray-300'}
        `}
        placeholder={props.placeholder}
        onChange={changeHandler}
        value={inputState.value}
        secureTextEntry={props.secureTextEntry || false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          touchHandler();
        }}
      />
      {!isValid && inputState.isTouched && (
        <Text className="text-xs italic text-red-500">{props.errorText}</Text>
      )}
    </View>
  );
};

export default InputForm;
