type LabelType = 'drawer'

export function makeLabel( data: Record<string, any>, type: LabelType ): string {
    if ( type === "drawer" ) {
        const { text } = data as { text:Array<string> };
        const rows = text.filter(i => i !== "");
        return(`
            ^XA
            ^PW344
            ^LL200

            ${rows.map((row, index) => (`
                ^FO0,${((200/(rows.length+1))*(index+1))-20}
                ^FB344,1,,C
                ^A0N,40,40
                ^FD${row}^FS
            `))}

            ^XZ
        `)
    }

    return ""
}