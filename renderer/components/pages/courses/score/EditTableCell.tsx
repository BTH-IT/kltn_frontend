/* eslint-disable no-unused-vars */
'use client';
import React, { useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';

const EditableCell: React.FC<{
  value: number | string;
  onSave: (newValue: number) => void;
}> = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    const regex = /^(\d*\.?\d*)$/;

    if (!value) {
      setInputValue(0);
      return;
    }

    // Kiểm tra nếu giá trị nhập vào khớp với định dạng và trong khoảng từ 0.0 đến 10.0
    if (value.length <= 4 && regex.test(value) && parseFloat(value) <= 10.0 && parseFloat(value) >= 0.0) {
      // Xóa bỏ các số 0 ở đầu
      value = value.replace(/^0+(?!\.|$)/, '');

      setInputValue(value);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    let newValue = parseFloat(inputValue as string);
    if (!isNaN(newValue)) {
      // Làm tròn tới 2 số thập phân
      newValue = parseFloat(newValue.toFixed(2));
      onSave(newValue);
    } else {
      setInputValue(value); // Reset to original value if input is invalid
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <td className="p-2 border" onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <Input
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          className="w-full"
          onBlur={handleBlur}
          pattern="^(\d*\.?\d*)$"
        />
      ) : (
        <span>{value}</span>
      )}
    </td>
  );
};

export default EditableCell;
