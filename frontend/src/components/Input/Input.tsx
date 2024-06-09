import React from 'react';
import styles from './Input.module.scss';

interface InputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  padding?: string;
  fontSize?: string;
  type?:string
  color?:string
}

const Input: React.FC<InputProps> = ({ value, onChange, placeholder, padding = '15px', fontSize='16px', type='text', color='#808080' }) => {
  const inputStyle = {
    padding,
    fontSize,
    color
  };

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={inputStyle}
      className={styles.textInput}
    />
  );
};

export default Input;
