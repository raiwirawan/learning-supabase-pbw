"use client";

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [pageIndex, setPageIndex] = useState(0);

	const pagination = {
		pageSize: rowsPerPage,
		pageIndex,
	};

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: { pagination },
		onPaginationChange: (updater) => {
			if (typeof updater === "function") {
				const newState = updater(pagination);
				setPageIndex(newState.pageIndex);
				setRowsPerPage(newState.pageSize);
			}
		},
	});

	return (
		<div>			<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="bg-gray-50/50">
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="border-t border-gray-200 transition-colors hover:bg-gray-50/50"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="py-4 px-6 text-sm">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center text-gray-500 italic"
								>
									No results found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>			<div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 bg-white">
				<div className="flex items-center gap-4">
					<select
						value={rowsPerPage}
						onChange={(e) => {
							const newSize = Number(e.target.value);
							table.setPageSize(newSize);
						}}
						className="h-9 w-[100px] rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
					>
						{[5, 10, 20, 30, 40, 50].map((pageSize) => (
							<option key={pageSize} value={pageSize}>
								{pageSize} rows
							</option>
						))}
					</select>
					<span className="flex items-center gap-1 text-sm text-gray-600">
						<span className="text-gray-400">Page</span> 
						{table.getState().pagination.pageIndex + 1} 
						<span className="text-gray-400">of</span>{" "}
						{table.getPageCount()}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						className="h-8 min-w-[70px] px-3 text-xs disabled:opacity-50"
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						className="h-8 min-w-[70px] px-3 text-xs disabled:opacity-50"
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
