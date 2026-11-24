import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../ui/shadcn/accordion";
import { cookieInputAtom, clearCookiesAtom, setCookiesAtom, storageTextAtom } from "./a-dev-tools-atoms";
import { playerItemsUrlAtom } from "../../store/a-local-storage-state";
import { useAccordionOpenState } from "../../store/a-local-storage-atoms";
import { Row2_PlayerItemsActions } from "./2-row2-player-items-actions";

/** Player items section: the items URL and JSON input in a persisted accordion. Hidden when there is no URL. */
export function Part_PlayerItems() {
    const playerItemsUrl = useAtomValue(playerItemsUrlAtom);
    const playerItemsAccordion = useAccordionOpenState('player-items');

    if (!playerItemsUrl) {
        return null;
    }

    return (
        <Accordion type="multiple" {...playerItemsAccordion}>
            <AccordionItem value="player-items">
                <AccordionTrigger>Player items</AccordionTrigger>
                <AccordionContent>
                    <Row2_PlayerItemsActions />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

/** Developer panels (cookies, localStorage test). Rendered in the dev server only. */
export function Part_DevPanels() {
    if (!import.meta.env.DEV) {
        return null;
    }

    return (
        <AccordionItem value="dev-panels">
            <AccordionTrigger>Dev tools</AccordionTrigger>
            <AccordionContent>
                <div className="p-3 bg-gray-100 border border-border rounded">
                    <CookieSetter />
                    <StorageText />
                    <Part_PlayerItems />
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

function CookieSetter() {
    const [cookieInput, setCookieInput] = useAtom(cookieInputAtom);
    const setCookies = useSetAtom(setCookiesAtom);
    const clearCookies = useSetAtom(clearCookiesAtom);

    return (
        <div className="mb-4 grid grid-cols-[1fr_auto_auto] gap-1">
            <Input
                className="text-xs bg-background"
                value={cookieInput}
                onChange={(event) => setCookieInput(event.target.value)}
                placeholder="Type cookie"
            />

            <Button variant="outline" size="sm" className="text-xs font-normal" onClick={() => clearCookies()} type="button">
                Clear Document Cookie
            </Button>

            <Button variant="outline" size="sm" className="text-xs font-normal" onClick={() => setCookies()} type="button">
                Set Cookie
            </Button>
        </div>
    );
}

function StorageText() {
    const [stored, setStored] = useAtom(storageTextAtom);

    return (
        <div className="text-xs flex flex-col items-start gap-2">
            <Button variant="outline" onClick={() => setStored((prev) => ({ ...prev, counter: prev.counter + 1 }))} type="button">
                count is: {stored.counter}
            </Button>

            <Button variant="outline" onClick={() => setStored((prev) => ({ ...prev, counter: 0 }))} type="button">
                reset count
            </Button>

            <Input
                className="text-gray-100 bg-purple-400/50"
                value={stored.text}
                onChange={(event) => setStored((prev) => ({ ...prev, text: event.target.value }))}
            />

            <Button variant="outline" onClick={() => setStored((prev) => ({ ...prev, text: `${prev.text}-` }))} type="button">
                Text: {stored.text}
            </Button>

            <Button variant="outline" onClick={() => setStored((prev) => ({ ...prev, text: '' }))} type="button">
                reset text
            </Button>
        </div>
    );
}
