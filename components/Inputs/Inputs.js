
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"

// ICONS
import UplaodIcon from "../Icons/UplaodIcon"

// UTILS
import { capitalizeFirstLetter } from "@/util/capitalizeFirstLetter/capitalizeFirstLetter"

// BASIC INPUT FIELD
export const Input = ({
    width,
    isRequired,
    label,
    height,
    error,
    properties,
    field,
    inputStyles,
    labelStyle
}) => {

    return (
        <>
            {label
                ? <label
                    css={input_label}
                    style={{ ...labelStyle }}
                >
                    {label} <span css={required_star} style={{ display: isRequired ? "inline" : "none" }}>*</span>
                </label>
                : null
            }

            <input
                css={input_field}
                style={{
                    width: width ? width : "100%",
                    height: height ? height : "40px",
                    border: error
                        ? "#ff6464fa"
                        : `1px solid var(--secondary-color)`,
                    ...inputStyles
                }}

                // Basic proeteries of input (type, placeholder etc)
                {...properties}

                // Field of useform controller
                {...field}
            />

            {error &&
                <div css={error_message}>
                    {error}
                </div>
            }
        </>
    )
}

// FILE TYPE INPUT
export const InputFile = ({
    width = "100%",
    isRequired,
    label,
    height = "35px",
    error,
    properties,
    field,
    labelStyle,
    fileName
}) => {

    return (
        <>
            <div css={input_label} style={{ marginBottom: ".5rem", marginTop: ".5rem", ...labelStyle }}>
                {label} <span css={required_star} style={{ display: isRequired ? "inline" : "none" }}>*</span>
            </div>

            <div css={file_input_container}>

                {/* label */}
                <label
                    htmlFor={field.name}
                    css={input_field}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        width,
                        height,
                        background: "#ffffff00",
                        border: error
                            ? `2px solid var(--error-color)`
                            : `1px solid var(--secondary-color)`,
                    }}
                >
                    <UplaodIcon width={14} css={upload_icon} />
                    {fileName}
                </label>

                {/* input */}
                <input
                    type="file"
                    id={field.name}
                    // Basic proeteries of input (placeholder etc)
                    {...properties}

                // Field of useform controller
                // {...field}
                />
            </div>

            {error &&
                <div css={error_message} style={{ marginBottom: 0 }}>
                    {error}
                </div>
            }
        </>
    )
}

// TEXTAREA INPUT FIELD
export const TextArea = ({
    width = "100%",
    height = "100px",
    isRequired,
    label,
    error,
    properties,
    field,
    inputStyles,
    labelStyle
}) => {
    return (
        <>
            <label
                css={input_label}
                style={{ marginBottom: ".5rem", marginTop: ".5rem", ...labelStyle }}
            >
                {label} <span css={required_star} style={{ display: isRequired ? "inline" : "none" }}>*</span>
            </label>

            <textarea
                css={[input_field, text_area_field]}
                style={{
                    width,
                    height,
                    border: error
                        ? `1px solid var(--error-color)`
                        : `1px solid var(--secondary-color)`,
                    ...inputStyles
                }}

                // Basic proeteries of input (type, placeholder etc)
                {...properties}

                // Field of useform controller
                {...field}
            />

            {error &&
                <div css={error_message}>
                    {error}
                </div>
            }
        </>
    )
}

// RADIO INPUT
export const RadioInput = ({ label, id, name, value, field, error }) => {
    return (
        <div
            css={radio_input}
        >
            <input
                css={radio}
                name={name}
                type="radio"
                id={id}
                value={value}
                {...field}
            />
            <label htmlFor={id}>{label}</label>
            {error &&
                <div css={error_message}>
                    {error}
                </div>
            }
        </div>
    )
}

// CHECKBOX INPUT
export const CheckboxInput = ({
    id,
    name,
    value,
    checked = false,
    onChange,
    label
}) => {
    return (
        <div css={filter_options}>
            <input
                type="checkbox"
                id={id}
                name={name}
                value={value}
                checked={checked}
                onChange={onChange ? () => onChange() : null}
            />
            <label for={id}> {capitalizeFirstLetter(label)}</label>
            {/* <br></br> */}
        </div>
    )
}

// CSS

const input_label = css`
    font-size: 1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    margin: .5rem 0;
`;

const file_input_container = css`
    position: relative;
    
    label {
        :hover {
            cursor: pointer;
        }
    }
`;

const required_star = css`
    color: var(--primary-color);
    font-size: 1rem;
    display: inline;
    margin-left: 0.35rem;
`;

const input_field = css`
    width: 100%;
    box-shadow: none;
    padding: 0 0.75rem;
    font-size: 1rem;
    outline: none;
    resize: none;
    
    :focus {
        border: none;
    }
`;

const text_area_field = css`
    padding-top: .5rem;
`;

const upload_icon = css`
    position: absolute;
    right: 1rem;
    top: auto.5rem;
    fill: var(--input-icon-color);
`;

const error_message = css`
    font-size: 0.9rem;
    color: var(--error-color);
    margin-top: 0.35rem;
    margin-bottom: 1rem;
    font-weight: 500;
`;

const radio_input = css`
    display: flex;
    align-items: center;
`;

const radio = css`
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
`;

const filter_options = css`
    margin-top: .25rem;
    margin-bottom: .5rem;

    label {
        margin-left: .25rem;
    }
`;