import React, { useState , useReducer, useEffect } from 'react';
import { View, Text, TextInput  } from 'react-native';
import { validate } from 'components/Shared/util/Validators';


const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
       ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
        isTouched: true,
      };

    case 'TOUCHED':
      return {...state, isTouched: true };
    default:
      return state;
  }



};


const InputForm = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false
  });
  const { id, onInput } = props;
  const { value, isValid } = inputState;

    useEffect(() => {
      onInput(id, value, isValid);
    }, [id, value, isValid, onInput]);

    const changeHandler = event => {
      dispatch({
        type: 'CHANGE',
        val: event.nativeEvent.text, 
        validators: props.validators
      });
    };

    const touchHandler = () => {
      dispatch({
        type: 'TOUCH'
      });
    };


  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className=" w-full mb-4">
      <Text className="text-gray-400 mb-2 text-sm font-semibold">{props.label}</Text>

      <TextInput
         className={`
          border rounded-lg py-4 px-4 
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
        <Text className="text-red-500 text-xs italic">{props.errorText}</Text>
      )}
      
    </View>
  );
};

export default InputForm;
