import React from "react";
import PropTypes from "prop-types";
import "./Button.css";


type Props = {
  id?: string,
  name?: string;
  children?: React.ReactElement[] | React.ReactElement | string | string []
  // All other props
  [rest:string]: any;
}

const Button = ({ children, ...rest }: Props): JSX.Element => {
  let btnClass = rest.choice === "yes" ? "YesButton Button" : rest.choice === "no" ? "NoButton Button" : "SubmitButton Button"
  return (
    <button className={rest.selected === rest.choice ? `${btnClass} Selected` : btnClass} {...rest}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  onClick: PropTypes.func
};

export default Button;
