/* eslint-disable no-unused-vars */
'use client';

import React, { useContext, useRef, useMemo, useCallback, useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { IScoreStructure } from '@/types/score-structure';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScoreStructureContext } from '@/contexts/ScoreStructureContext';
import { toast } from '@/components/ui/use-toast';

interface ScoreStructureAccordionProps {
  index: string;
  scoreStructure: IScoreStructure | undefined;
}

const ScoreStructureAccordion: React.FC<ScoreStructureAccordionProps> = ({ index, scoreStructure }) => {
  const { scoreStructures, setScoreStructures } = useContext(ScoreStructureContext);

  const [columnName, setColumnName] = useState<string>(scoreStructure?.columnName || '');
  const [percent, setPercent] = useState<number>(scoreStructure?.percent || 0);
  const [previousPercent, setPreviousPercent] = useState<number>(percent);

  const columnRef = useRef<HTMLInputElement>(null);
  const percentRef = useRef<HTMLInputElement>(null);

  const updateScoreStructures = useCallback(
    (updatedStructures: IScoreStructure[]) => {
      setScoreStructures(updatedStructures);
    },
    [setScoreStructures],
  );

  const handleAddDivideColumns = useCallback(
    (parent: IScoreStructure) => {
      const halfPercent = parent.percent / 2.0;
      const firstChild = createChildStructure(parent, halfPercent, 1);
      const secondChild = createChildStructure(parent, halfPercent, 2);

      const updatedStructures = [
        ...scoreStructures.map((item) =>
          item.id === parent.id
            ? {
                ...item,
                divideColumnFirst: firstChild.id,
                divideColumnSecond: secondChild.id,
              }
            : item,
        ),
        firstChild,
        secondChild,
      ];

      updateScoreStructures(updatedStructures);
    },
    [scoreStructures, updateScoreStructures],
  );

  const createChildStructure = (parent: IScoreStructure, percent: number, index: number): IScoreStructure => ({
    id: uuidv4(),
    columnName: `${parent.columnName} ${index}`,
    percent,
    parentId: parent.id,
    maxPercent: percent,
  });

  const handleRemoveDivideColumns = useCallback(
    (parent: IScoreStructure) => {
      const updatedStructures = scoreStructures.filter(
        (item) => item.id !== parent.divideColumnFirst && item.id !== parent.divideColumnSecond,
      );

      const parentIndex = updatedStructures.findIndex((item) => item.id === parent.id);
      updatedStructures[parentIndex] = {
        ...parent,
        divideColumnFirst: null,
        divideColumnSecond: null,
      };

      updateScoreStructures(updatedStructures);
    },
    [scoreStructures, updateScoreStructures],
  );

  const handleValidatePercent = useCallback(
    (newPercent: number, structure: IScoreStructure) => {
      if (newPercent < 0 || newPercent > 100) {
        showToast('Invalid Percent', 'The percentage must be between 0 and 100.');
        return false;
      }

      const parent = scoreStructures.find((item) => item.id === structure.parentId);

      if (parent) {
        const siblingsPercent = calculateSiblingsPercent(parent.id, structure.id);
        if (newPercent + siblingsPercent > parent.percent) {
          showToast('Invalid Percent', `The combined percentage of siblings cannot exceed ${parent.percent}%.`);
          return false;
        }
      }

      return true;
    },
    [scoreStructures],
  );

  const showToast = (title: string, description: string) => {
    toast({ title, description, variant: 'destructive' });
  };

  const calculateSiblingsPercent = (parentId: string, excludeId: string) => {
    return scoreStructures
      .filter((item) => item.parentId === parentId && item.id !== excludeId)
      .reduce((acc, item) => acc + item.percent, 0);
  };

  const handleUpdatePercent = (structure: IScoreStructure, newPercent: number) => {
    if (handleValidatePercent(newPercent, structure)) {
      const updatedStructures = scoreStructures.map((item) =>
        item.id === structure.id ? { ...item, percent: newPercent } : item,
      );

      updateScoreStructures(updatedStructures);
      setPreviousPercent(newPercent);
    } else {
      setPercent(previousPercent);
    }
  };

  const divideColumns = useMemo(() => {
    if (scoreStructure) {
      return {
        firstChild: scoreStructures.find((item) => item.id === scoreStructure.divideColumnFirst),
        secondChild: scoreStructures.find((item) => item.id === scoreStructure.divideColumnSecond),
      };
    }
    return { firstChild: undefined, secondChild: undefined };
  }, [scoreStructure, scoreStructures]);

  return (
    <div className="mt-5">
      <div className="flex gap-3 items-center">
        <Input placeholder="column name" value={columnName} onChange={(e) => setColumnName(e.target.value)} />
        <Input
          className="max-w-[70px]"
          placeholder="percent"
          value={percent}
          onChange={(e) => {
            const newPercent = Number(e.target.value);
            setPercent(newPercent);
            handleUpdatePercent(scoreStructure!, newPercent);
          }}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="flex-shrink-0 cursor-pointer">
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-auto" align="end">
            <DropdownMenuGroup>
              {!scoreStructure?.divideColumnFirst && !scoreStructure?.divideColumnSecond && (
                <DropdownMenuItem onClick={() => handleAddDivideColumns(scoreStructure!)}>
                  Chia thành 2 cột điểm
                </DropdownMenuItem>
              )}
              {scoreStructure?.divideColumnFirst && scoreStructure?.divideColumnSecond && (
                <DropdownMenuItem onClick={() => handleRemoveDivideColumns(scoreStructure!)}>
                  Xóa 2 cột điểm
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {divideColumns.firstChild && divideColumns.secondChild && (
        <Accordion type="single" collapsible defaultValue={scoreStructure?.id || ''}>
          <AccordionItem value={scoreStructure?.id || ''}>
            <AccordionTrigger>2 cột đã chia của {scoreStructure?.columnName}</AccordionTrigger>
            <AccordionContent className="pl-3 ml-2 border-l border-l-primaryGray">
              <ScoreStructureAccordion index={`${index}.1`} scoreStructure={divideColumns.firstChild} />
              <ScoreStructureAccordion index={`${index}.2`} scoreStructure={divideColumns.secondChild} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default ScoreStructureAccordion;
