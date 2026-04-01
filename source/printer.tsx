import net from 'net';

function checkPort( ip:string, port:number, timeout:number = 1000 ):Promise<boolean> {
    return new Promise(resolve => {
        const socket = new net.Socket();
        let isOpen = false;

        socket.setTimeout(timeout);
        socket.on('connect', () => {
            isOpen = true;
            socket.destroy();
        });
        socket.on('timeout', () => socket.destroy());
        socket.on('error', () => {});
        socket.on('close', () => resolve(isOpen));

        socket.connect(port, ip);
    });
}

export async function findPrinter( subnet:string = '192.168.1' ):Promise<Array<string>> {
    const ips = Array.from({ length: 254 }, (_, i) => `${subnet}.${i+1}`);

    const results = await Promise.all(
        ips.map(async ip => {
            const isOpen = await checkPort(ip, 9100);
            return isOpen ? ip : null;
        })
    );

    return results.filter((ip): ip is string => ip !== null);
}

export function printZPL( zpl:string, ip:string, port:number = 9100):Promise<void> {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        socket.connect(port, ip, () => {
            socket.write(zpl);
            socket.end();
            resolve();
        });

        socket.on('error', (err:Error) => reject(err));
    })
}