import React, { useEffect, useCallback } from "react";
import ReactToPrint from "react-to-print";

const invoiceOrder = ({ data }) => {
    const componentRef = React.useRef(null);
    const [text, setText] = React.useState([]);

    const handleAfterPrint = React.useCallback(() => {
        console.log("`onAfterPrint` called");
    }, []);

    const handleBeforePrint = useCallback(() => {
        setText(data);
        console.log("`onBeforePrint` called");
    }, []);

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);

    const reactToPrintTrigger = useCallback(() => {
        return <button>In hóa đơn</button>;
    }, []);

    return (
        <>
            <ReactToPrint
                content={reactToPrintContent}
                documentTitle='AwesomeFileName'
                onAfterPrint={handleAfterPrint}
                onBeforePrint={handleBeforePrint}
                removeAfterPrint
                trigger={reactToPrintTrigger}
            />
        </>
    );
};

export default invoiceOrder;
