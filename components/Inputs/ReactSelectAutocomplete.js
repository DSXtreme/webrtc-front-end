/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { forwardRef, useImperativeHandle, useRef } from 'react';
import Select from 'react-select';
import AsyncCreatableSelect from 'react-select/async-creatable';

export const AutocompleteAsycCreateable = ({
    label = "Label",
    isMulti,
    cacheOptions,
    form,
    loadOptions,
    defaultValue,
    loading,
    field,
    onChange,
    error
}) => {

    return (

        <>
            <div css={label_container}>
                {label}
            </div>
            < AsyncCreatableSelect
                {...field}
                isMulti={isMulti}
                cacheOptions={cacheOptions}
                defaultValue={defaultValue}
                loadOptions={loadOptions}
                form={form}
                loading={loading}
                styles={{

                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: "var(--input-border-color)",
                        borderRadius: 0,
                        boxShadow: state.isFocused ? "none" : "none",
                        cursor: "pointer"
                    }),
                    option: (baseStyle, state) => ({
                        ...baseStyle,
                        color:
                            state.isFocused
                                ? "var(--autocomplete-item-hover-bg-color)"
                                : state.isSelected
                                    ? "var(--autocomplete-item-background-color)"
                                    : "var(--autocomplete-item-font-color)",
                        background:
                            state.isFocused
                                ? "var(--autocomplete-item-hover-bg-color)"
                                : state.isSelected
                                    ? "var(--autocomplete-item-selected-bg-color)"
                                    : "#00000000"
                    })
                }}
                theme={(selecttheme) => ({
                    ...selecttheme,
                    colors: {
                        ...selecttheme.colors,

                        // for border color while hover once the menu is open
                        primary: "var(--autocomplete-item-border-color)",

                    },
                })
                }
                onChange={(val) => {
                    onChange({ data: val })
                }}
            />
            {error && <div css={error_message}>{error}</div>}
        </>

    )
}

export const AutoCompleteSelect = forwardRef(({
    label = "Label",
    isMulti,
    disabled,
    options,
    value,
    isClearable,
    defaultValue,
    loading,
    onChange,
    error,
    isSearchable,
    isRequired
}, ref) => {
    const selectRef = useRef(null);

    // Passing clear Selection function to parent with ref using useImperativeHandle
    useImperativeHandle(ref, () => ({
        // Claer function to be called form parent to clear using ref
        clearSelection() {
            if (selectRef.current) {
                selectRef.current.clearValue() // Clear the selection
            }
        }
    }));

    return (
        <>
            {
                label
                    ? <div css={label_container}>
                        {label} <span css={required_star} style={{ display: isRequired ? "inline" : "none" }}>*</span>
                    </div>
                    : null
            }
            
            <Select
                defaultValue={defaultValue}
                isMulti={isMulti}
                isDisabled={disabled}
                isLoading={loading}
                isClearable={isClearable}
                isSearchable={isSearchable}
                value={value}
                options={options}
                onChange={(val) => {
                    if (val) {
                        onChange({ data: val })
                    }
                }}
                ref={selectRef}
                styles={{

                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor:
                            error
                                ? "var(--error-color)"
                                : disabled
                                    ? "var(--autocomplete-disabled-border-color)"
                                    : "var(--autocomplete-border-color)",
                        borderRadius: 0,
                        borderWidth: "1px",
                        boxShadow: state.isFocused ? "none" : "none",
                        cursor: "pointer"
                    }),
                    option: (baseStyle, state) => (
                        {
                            ...baseStyle,
                            color:
                                state.isFocused
                                    ? "var(--autocomplete-item-hover-font-color)"
                                    : state.isSelected
                                        ? "var(--autocomplete-item-background-color)"
                                        : "var(--autocomplete-item-font-color)",
                            background:
                                state.isFocused
                                    ? "var(--autocomplete-item-hover-bg-color)"
                                    : state.isSelected
                                        ? "var(--autocomplete-item-selected-bg-color)"
                                        : "#00000000"
                        })
                }}
                theme={(selecttheme) => ({
                    ...selecttheme,
                    colors: {
                        ...selecttheme.colors,
                        // for border color while hover once the menu is open
                        primary: "var(--autocomplete-item-border-color)",

                    }
                })
                }
            />
            {error && <div css={error_message}>{error}</div>}
        </>
    )
})

// css
const label_container = css`
    font-size: 1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    margin: .5rem 0;
`

const error_message = css`
  font-size: 0.9rem;
  color: var(--error-color);
  margin-top: 0.35rem;
  margin-bottom: 1rem;
  font-weight: 500;
`

const required_star = css`
  color: var(--primary-color);
  font-size: 1rem;
  display: inline;
  margin-left: 0.35rem;
`