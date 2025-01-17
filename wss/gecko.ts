import { isElementAccessExpression } from "typescript";

class GeckoWsshandler {

    // making the instance of the class
    private static instance: GeckoWsshandler;
    // State
    private wssStore: Map<String, { wss: WebSocket, count: number }> = new Map();
    private constructor() {
        console.log("Hello! Gecko Has been initialized.")
    }

    // making the handler for only making the constrctor one time
    static async getGeckoInstance() {
        if (!GeckoWsshandler.instance) {
            return new GeckoWsshandler();
        } else {
            return GeckoWsshandler.instance;
        }
    }

    // adding the wss to the store
    private addWss(key: string, wss: WebSocket) {
        if (this.wssStore.has(key)) {
            let wssData = this.wssStore.get(key);
            if (wssData) {
                wssData.count += 1;
            }
            if (wssData) {
                this.wssStore.set(key, wssData);
            }
        }
        this.wssStore.set(key, { wss, count: 1 });
    }

    private static handleParseInformation(parsed: any) {

        if (parsed.message?.data) {
            const swapData = parsed.message.data;
            console.log("New Swap Event:");
            console.log(swapData);
            console.log(
                `- From Token: ${swapData.from_token_id} (${swapData.from_token_amount})`
            );
            console.log(
                `- To Token: ${swapData.to_token_id} (${swapData.to_token_amount})`
            );
            console.log(`- Transaction: ${swapData.tx_hash}`);
        }

    }
    initWebocket(key: string) {
        const headers = {
            "Cache-Control": "no-cache",
            Connection: "Upgrade",
            Origin: "https://www.geckoterminal.com",
            Pragma: "no-cache",
            // "Sec-WebSocket-Key": "",
            "Sec-WebSocket-Version": "13",
            Upgrade: "websocket",
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15",
        };
        let wss = new WebSocket("wss://cables.geckoterminal.com/cable");

        wss.on("open", () => {
            console.log("WebSocket connection opened");

            // Subscribe to SwapChannel for pool_id 169929632
            const subscriptionMessage = JSON.stringify({
                command: "subscribe",
                identifier: JSON.stringify({
                    channel: "SwapChannel",
                    pool_id: "169929632",
                }),
            });

            wss.send(subscriptionMessage);
            console.log("Subscription message sent");
        });

        wss.on("message", (data) => {
            const parsed = JSON.parse(data.toString());
            GeckoWsshandler.handleParseInformation(parsed);
        });

        wss.on("close", () => {
            console.log("WebSocket connection closed");
        });

        wss.on("error", (error) => {
            console.error("WebSocket error:", error);
        });
        this.addWss(key, wss);
    }
}
