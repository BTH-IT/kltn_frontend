export interface IScoreStructure {
  id: string;
  columnName: string;
  percent: number;
  parentId?: string | null;
  maxPercent?: number | null;
  children: IScoreStructure[];
}

export interface TableCellProps {
  data: IScoreStructure[];
  item: IScoreStructure;
  leafColumns: number;
}
