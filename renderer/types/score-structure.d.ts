export interface IScoreStructure {
  id: string;
  columnName: string;
  percent: number;
  divideColumnFirst?: string | null;
  divideColumnSecond?: string | null;
  parentId?: string | null;
  maxPercent?: number | null;
  children?: IScoreStructure[];
}

export interface TableCellProps {
  data: IScoreStructure[];
  item: IScoreStructure;
  leafColumns: number;
}
