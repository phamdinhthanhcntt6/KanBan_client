import { utils, writeFileXLSX } from "xlsx";

export const handleExportToExcel = (data: any[], fileName: string) => {
  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();

  utils.book_append_sheet(wb, ws, `data`);

  writeFileXLSX(wb, `${fileName ? fileName : `KanBan_${Date.now()}`}.xlsx`);
};
