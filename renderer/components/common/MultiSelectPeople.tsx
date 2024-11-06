/* eslint-disable no-unsafe-optional-chaining */
import Image from 'next/image';
import React, { useState, useRef } from 'react';
import { default as ReactSelect, components, InputAction } from 'react-select';

export type Option = {
  value: number | string;
  label: string;
  default?: boolean;
};

const MultiSelectPeople = (props: any) => {
  const [selectInput, setSelectInput] = useState<string>('');
  const isAllSelected = useRef<boolean>(false);
  const selectAllLabel = useRef<string>('Chọn tất cả');
  const allOption = { value: '*', label: selectAllLabel.current };

  const filterOptions = (options: Option[], input: string) => {
    console.log(options);
    return options?.filter(({ label }: Option) => label.toLowerCase().includes(input.toLowerCase()));
  };

  const comparator = (v1: Option, v2: Option) => (v1.value as number) - (v2.value as number);

  let filteredOptions = filterOptions(props.options, selectInput);
  let filteredSelectedOptions = filterOptions(props.value, selectInput);

  const Option = (props: any) => (
    <components.Option {...props} className="h-[55px]">
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
            checked={props.isSelected || isAllSelected.current}
            onChange={() => {}}
            className="w-4 h-4 line-clamp-1"
          />
        )}
        <div className="flex items-center gap-2 ml-5">
          <Image
            src={props.data.image ?? '/images/avt.png'}
            alt="logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <label>{props.label}</label>
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
        <div>
          <components.Input autoFocus={props.selectProps.menuIsOpen} {...props}>
            {props.children}
          </components.Input>
        </div>
      )}
    </>
  );

  const customFilterOption = ({ value, label }: Option, input: string) =>
    (value !== '*' && label.toLowerCase().includes(input.toLowerCase())) ||
    (value === '*' && filteredOptions?.length > 0);

  const onInputChange = (inputValue: string, event: { action: InputAction }) => {
    if (event.action === 'input-change') setSelectInput(inputValue);
    else if (event.action === 'menu-close' && selectInput !== '') setSelectInput('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && !selectInput) e.preventDefault();
  };

  const handleChange = (selected: Option[]) => {
    if (
      selected.length > 0 &&
      !isAllSelected.current &&
      (selected[selected.length - 1].value === allOption.value ||
        JSON.stringify(filteredOptions) === JSON.stringify(selected.sort(comparator)))
    )
      return props.onChange(
        [
          ...(props.value ?? []),
          ...props.options.filter(
            ({ label }: Option) =>
              label.toLowerCase().includes(selectInput?.toLowerCase()) &&
              (props.value ?? []).filter((opt: Option) => opt.label === label).length === 0,
          ),
        ].sort(comparator),
      );
    else if (
      selected.length > 0 &&
      selected[selected.length - 1].value !== allOption.value &&
      JSON.stringify(selected.sort(comparator)) !== JSON.stringify(filteredOptions)
    )
      return props.onChange(selected);
    else
      return props.onChange([
        ...props.value?.filter(({ label }: Option) => !label.toLowerCase().includes(selectInput?.toLowerCase())),
      ]);
  };

  const customStyles = {
    multiValueLabel: (def: any) => ({
      ...def,
      backgroundColor: 'lightgray',
    }),
    multiValueRemove: (def: any) => ({
      ...def,
      backgroundColor: 'lightgray',
    }),
    valueContainer: (base: any) => ({
      ...base,
      maxHeight: '35.7px',
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

  if (props.isSelectAll && props?.options?.length !== 0) {
    isAllSelected.current = filteredSelectedOptions?.length === filteredOptions?.length;

    if (filteredSelectedOptions?.length > 0) {
      if (filteredSelectedOptions?.length === filteredOptions?.length)
        selectAllLabel.current = `Đã chọn (${filteredOptions.length})`;
      else selectAllLabel.current = `Đã chọn ${filteredSelectedOptions?.length} / ${filteredOptions.length}`;
    } else selectAllLabel.current = 'Chọn tất cả';

    allOption.label = selectAllLabel.current;

    return (
      <ReactSelect
        {...props}
        isDisabled={props.isDisabled}
        inputValue={selectInput}
        onInputChange={onInputChange}
        onKeyDown={onKeyDown}
        options={[allOption, ...props?.options]}
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
      isDisabled={props.isDisabled}
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

export default MultiSelectPeople;
