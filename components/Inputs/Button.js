// PACAKAGES
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { motion } from "framer-motion";

// FILLED BUTTON COMPONENT
export const ButtonComponent = ({
    width,
    height,
    borderRadius,
    loading,
    children,
    typeSubmit,
    onClick,
    style,
    disabled
}) => {
    return (
        <motion.button
            disabled={disabled || loading}
            css={button}
            whileTap={{
                scale: 0.95,
                transition: {
                    duration: 0.1,
                },
            }}
            whileHover={!loading && !disabled
                ? {
                    background: "var(--button-hover-color)",
                    cursor: "pointer"
                }
                : {
                    background: "var(--button-disabled-color)",
                    cursor: "not-allowed"
                }
            }
            initial={{ background: "var(--button-background-color)" }}
            animate={{ background: (loading || disabled) ? "var(--button-disabled-color)" : "var(--button-background-color)" }}
            style={{
                width: width ? width : "100px",
                height: height ? height : "40px",
                ...style,
            }}
            type={typeSubmit ? "submit" : "none"}
            onClick={onClick ? () => onClick() : null}
        >
            {
                loading
                    ? <div>Loading...</div>
                    : <div>{children}</div>
            }
        </motion.button>
    );
};

// BORDERED BUTTON COMPONENT
export const BorderedButtonComponent = ({
    width,
    height,
    loading,
    children,
    typeSubmit,
    onClick,
    style,
    disabled
}) => {
    return (
        <motion.button
            disabled={disabled || loading}
            css={bordered_button}
            whileTap={{
                scale: 0.95,
                transition: {
                    duration: 0.1,
                },
            }}
            initial={{
                background: "var(--bordered-button-bg-color)",
                fill: "var(--delete-icon-color)"
            }}
            whileHover={{
                background: disabled || loading ? null : "var(--bordered-button-hover-bg-color)",
                color: disabled || loading ? "var(--bordered-button-disabled-color)" : "var(--bordered-button-hover-font-color)",
                cursor: disabled || loading ? "not-allowed" : "pointer",
                fill: "var(--bordered-button-hover-font-color)"
            }}
            animate={{
                border: disabled || loading ? "1px solid var(--bordered-button-disabled-color)" : `1px solid var(--bordered-button-border-color)`,
                background: "var(--bordered-button-bg-color)",
                color: disabled || loading ? "var(--bordered-button-disabled-color)" : "var(--bordered-button-font-color)",
            }}
            style={{
                width: width ? width : "100px",
                height: height ? height : "40px",
                borderRadius: ".5rem",
                fontSize: "clamp(0.9rem, 2vw, 1rem)",
                ...style,
            }}
            type={typeSubmit ? "submit" : "none"}
            onClick={() => {
                onClick ? onClick() : null;
            }}
        >
            {
                loading
                    ? <div>Loading...</div>
                    : children
            }
        </motion.button>
    );
};

// css

const button = css`
    font-family: inherit;
    color: inherit;
    border: none;
    padding: 0;
    outline: inherit;
    cursor: pointer;
    border-radius: 0.5rem;
    background-color: var(--button-background-color);
    color: var(--button-font-color);
    font-size: clamp(0.9rem, 2vw, 1rem);

    :disabled {
        background-color: var(--button-disabled-color);
        cursor: not-allowed;
    }
`;


const bordered_button = css`
    :disabled {
        background-color: var(--button-disabled-color);
        cursor: not-allowed;
    }
`;