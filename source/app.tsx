import React, { ReactElement, useEffect, useState } from 'react';
import {Box, Text, useInput, useStdout} from 'ink';
import Spinner from 'ink-spinner';
import { findPrinter, printZPL } from './printer.js';
import SelectInput from 'ink-select-input';
import { makeLabel } from './labelMaker.js';
import TextInput from 'ink-text-input';

interface ItemSelectInput {
	label: string;
	value: string;
}

function Loading():ReactElement {
	return(
		<Text>
			<Text color={'greenBright'}>
				<Spinner type='arc'/>
			</Text>
			{'Loading '}
			<Spinner type='simpleDots'/>
		</Text>
	)
}

function SelectPrinter({ setPrinter }: { setPrinter: (printer:string) => void }):ReactElement {
	const [printers, setPrinters] = useState<ItemSelectInput[] | null>(null);

	useEffect(() => {
		findPrinter().then((printers: string[]) => {
			setPrinters(
				printers.map((item: string) => ({
					label: item,
					value: item,
				}))
			);
		})
	}, []);

	if (printers === null) return <Loading />

	return (
		<SelectInput items={printers} onSelect={(item) => setPrinter(item.value)}/>
	)
}

export default function App() {
	const [printer, setPrinter] = useState<string | null>(null)
	const [text, setText] = useState<Array<string>>(["", "", ""]);
	const [focus, setFocus] = useState<number>(0);

	const { stdout } = useStdout();

	useInput((_, key) => {
		if (key.upArrow) setFocus(f => Math.max(0, f - 1))
		if (key.downArrow) setFocus(f => Math.min(text.length - 1, f + 1))
		if (key.return && printer!==null) printZPL(makeLabel({text: text}, "drawer"), printer)
	});

	if (printer === null) return <Box width={stdout.columns} height={stdout.rows}><SelectPrinter setPrinter={setPrinter}/></Box>

	return (
		<Box width={stdout.columns} height={stdout.rows} justifyContent='center'>
			<Box flexDirection='column' borderColor={'white'} borderStyle={'round'} width={20} height={5} justifyContent='center'>
				{text.map((row, index) => <Box overflow='hidden' height={1} justifyContent='center'><TextInput focus={index===focus} showCursor={index===focus} value={row} onChange={value => setText(t => t.map((r,i) => (i===index?value:r)))}/></Box>)}
			</Box>
		</Box>
	);
}
