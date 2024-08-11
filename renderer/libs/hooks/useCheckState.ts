import { useState } from 'react';

export type PersonState = {
  userId: string;
  email: string;
  checked: Boolean;
};

export function useCheckedState(initialState: PersonState[]) {
  const [checkedState, setCheckedState] = useState(initialState);
  const [allChecked, setAllChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  const handleAllCheckedChange = () => {
    const newState = !allChecked;
    setCheckedState((prev: any) => prev.map((item: PersonState) => ({ ...item, checked: newState })));
    setAllChecked(newState);
    setIndeterminate(false);
  };

  const handleIndividualCheckedChange = (userId: string) => {
    const newCheckedState = checkedState.map((item: PersonState) =>
      item.userId === userId ? { ...item, checked: !item.checked } : item,
    );
    setCheckedState(newCheckedState);

    const allChecked = newCheckedState.every((item: PersonState) => item.checked);
    const noneChecked = newCheckedState.every((item: PersonState) => !item.checked);

    setAllChecked(allChecked);
    setIndeterminate(!allChecked && !noneChecked);
  };

  return {
    checkedState,
    handleAllCheckedChange,
    handleIndividualCheckedChange,
    allChecked,
    indeterminate,
    setCheckedState,
  };
}
