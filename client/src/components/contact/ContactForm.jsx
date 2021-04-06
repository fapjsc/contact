import { useState, useContext, useEffect } from "react";
import ContactContext from "../../context/contact/contactContext";

const ContactForm = () => {
    const contactContext = useContext(ContactContext);
    const { addContact, updateContact, clearCurrent, current } = contactContext;

    const [contact, setContact] = useState({
        name: "",
        email: "",
        phone: "",
        type: "personal",
    });

    const { name, email, phone, type } = contact;

    useEffect(() => {
        if (current !== null) {
            console.log(current);
            setContact(current);
        } else {
            setContact({
                name: "",
                email: "",
                phone: "",
                type: "personal",
            });
        }
    }, [current, contactContext]);

    const onChange = e => {
        setContact({ ...contact, [e.target.name]: e.target.value });
    };

    const clearAll = () => {
        clearCurrent();
    };

    const onSubmit = e => {
        e.preventDefault();

        if (name === "" || email === "" || phone === "") {
            return;
        }

        if (current === null) {
            addContact(contact);
        } else {
            updateContact(contact);
        }

        clearAll();
    };

    return (
        <form onSubmit={onSubmit}>
            <h2 className="text-primary">{current ? "Edit Contact" : "Add Contact"}</h2>
            <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} />
            <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={onChange}
            />
            <input type="text" placeholder="Phone" name="phone" value={phone} onChange={onChange} />
            <h5>Contact Type</h5>
            <input
                id="personal"
                type="radio"
                name="type"
                value="personal"
                checked={type === "personal"}
                onChange={onChange}
            />
            <label htmlFor="personal">Personal </label>
            <input
                id="professional"
                type="radio"
                name="type"
                value="professional"
                checked={type === "professional"}
                onChange={onChange}
            />
            <label htmlFor="professional">Professional </label>
            <div>
                <input
                    type="submit"
                    className="btn btn-primary btn-block"
                    value={current ? "Update Contact" : "Add Contact"}
                />
            </div>
            {current && (
                <div>
                    <button className="btn btn-light btn-block" onClick={clearAll}>
                        Clear
                    </button>
                </div>
            )}
        </form>
    );
};

export default ContactForm;
