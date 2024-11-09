/* eslint-disable no-unsafe-optional-chaining */
'use client';

import React, { useState, useRef } from 'react';
import { default as ReactSelect, components, InputAction } from 'react-select';

export type Option = {
  value: number | string;
  label: string;
  default?: boolean;
};

const MultiSelectClassroom = (props: any) => {
  const [selectInput, setSelectInput] = useState<string>('');
  const isAllSelected = useRef<boolean>(false);

  const filterOptions = (options: Option[], input: string) =>
    options?.filter(({ label }: Option) => label?.toLowerCase().includes(input.toLowerCase()));

  let filteredOptions = filterOptions(props.options, selectInput);
  let filteredSelectedOptions = filterOptions(props.value, selectInput);

  const Option = (props: any) => (
    <components.Option {...props} className="min-h-[58px]">
      <div className="flex flex-row items-center">
        {props.value === '*' && !isAllSelected.current && filteredSelectedOptions?.length > 0 ? (
          <input
            key={props.value}
            type="checkbox"
            ref={(input) => {
              if (input && !isAllSelected.current) input.indeterminate = true;
            }}
            className="w-4 h-4 line-clamp-1"
          />
        ) : (
          <input
            key={props.value}
            type="checkbox"
            checked={props.data.default || props.isSelected || isAllSelected.current}
            disabled={props.data.default}
            onChange={() => {}}
            className="w-4 h-4 line-clamp-1"
          />
        )}
        <div className="flex flex-row items-center gap-3 pt-1 ml-5">
          <div className="flex items-center justify-center text-sm font-medium text-white uppercase bg-blue-500 rounded-full w-9 h-9">
            {props.value !== '*' ? props.label[0] ?? 'A' : 'All'}
          </div>
          <label className="line-clamp-1">{props.label}</label>
        </div>
      </div>
    </components.Option>
  );

  const Input = (props: any) => (
    <>
      {selectInput.length === 0 ? (
        <components.Input autoFocus={props.selectProps.menuIsOpen} {...props}>
          {props.children}
        </components.Input>
      ) : (
        <div style={{ borderBlockEnd: '1px dotted gray' }}>
          <components.Input autoFocus={props.selectProps.menuIsOpen} {...props}>
            {props.children}
          </components.Input>
        </div>
      )}
    </>
  );

  const customFilterOption = ({ value, label }: Option, input: string) =>
    (value !== '*' && label?.toLowerCase().includes(input.toLowerCase())) ||
    (value === '*' && filteredOptions?.length > 0);

  const onInputChange = (inputValue: string, event: { action: InputAction }) => {
    if (event.action === 'input-change') setSelectInput(inputValue);
    else if (event.action === 'menu-close' && selectInput !== '') setSelectInput('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && !selectInput) e.preventDefault();
  };

  const handleChange = (selected: Option[]) => {
    if (selected.length > 0) {
      return props.onChange(selected);
    } else {
      return props.onChange([
        ...props.value?.filter(({ label }: Option) => !label.toLowerCase().includes(selectInput?.toLowerCase())),
      ]);
    }
  };

  const customStyles = {
    multiValueLabel: (def: any) => ({
      ...def,
      backgroundColor: 'lightgray',
      padding: '3px 6px',
    }),
    multiValueRemove: (base: any, state: any) => ({
      ...base,
      backgroundColor: 'lightgray',
      display: state.data.default ? 'none' : 'block',
    }),
    valueContainer: (base: any) => ({
      ...base,
      maxHeight: '65px',
      overflow: 'auto',
    }),
    option: (styles: any, { isSelected, isFocused }: any) => {
      return {
        ...styles,
        backgroundColor:
          isSelected && !isFocused
            ? null
            : isFocused && !isSelected
              ? styles.backgroundColor
              : isFocused && isSelected
                ? '#DEEBFF'
                : null,
        color: isSelected ? null : null,
      };
    },
    menu: (def: any) => ({ ...def, zIndex: 9999 }),
  };

  if (props.isSelectAll && props.options.length !== 0) {
    isAllSelected.current = filteredSelectedOptions?.length === filteredOptions?.length;

    return (
      <ReactSelect
        {...props}
        inputValue={selectInput}
        onInputChange={onInputChange}
        onKeyDown={onKeyDown}
        options={props.options}
        onChange={handleChange}
        components={{
          Option: Option,
          Input: Input,
          ...props.components,
        }}
        filterOption={customFilterOption}
        menuPlacement={props.menuPlacement ?? 'auto'}
        styles={customStyles}
        isMulti
        closeMenuOnSelect={false}
        tabSelectsValue={false}
        backspaceRemovesValue={false}
        hideSelectedOptions={false}
        blurInputOnSelect={false}
      />
    );
  }

  return (
    <ReactSelect
      {...props}
      inputValue={selectInput}
      onInputChange={onInputChange}
      filterOption={customFilterOption}
      components={{
        Input: Input,
        ...props.components,
      }}
      menuPlacement={props.menuPlacement ?? 'auto'}
      onKeyDown={onKeyDown}
      tabSelectsValue={false}
      hideSelectedOptions={true}
      backspaceRemovesValue={false}
      blurInputOnSelect={true}
    />
  );
};

export default MultiSelectClassroom;
