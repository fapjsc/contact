import { useRef, useContext, useEffect } from "react";
import ContactContext from "../../context/contact/contactContext";

const ContactFilter = () => {
    const contactContext = useContext(ContactContext);
    const { filtered, filterContacts, clearFilter } = contactContext;
    const text = useRef("");

    useEffect(() => {
        if (filtered === null) {
            text.current.value = "";
        }
    }, [filtered]);

    const onChange = e => {
        if (text.current.value !== "") {
            filterContacts(e.target.value);
        } else {
            clearFilter();
        }
    };

    return (
        <form>
            <input type="text" ref={text} placeholder="search contact..." onChange={onChange} />
        </form>
    );
};

export default ContactFilter;
