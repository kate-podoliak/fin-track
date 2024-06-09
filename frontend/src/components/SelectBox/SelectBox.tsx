import React from 'react';
import Select, { SingleValue } from 'react-select';
import styles from "./SelectBox.module.scss"

interface Category {
  id: number;
  name: string;
}

interface SelectBoxProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  categories: Category[];
}

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    padding: '10px 15px',
    fontSize: '16px',
    cursor: 'pointer',
  }),
};

const SelectBox: React.FC<SelectBoxProps> = ({ selectedCategory, setSelectedCategory, categories }) => {
  const options = categories.map(category => ({
    value: category.id.toString(),
    label: category.name,
  }));

  const handleChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
    if (selectedOption) {
      setSelectedCategory(selectedOption.value);
    } else {
      setSelectedCategory('');
    }
  };

  return (
    <Select
      value={options.find(option => option.value === selectedCategory)} // Находим соответствующий объект по значению
      onChange={handleChange}
      options={options}
      isSearchable={false}
      styles={customStyles}
      placeholder="Оберіть категорію"
    />
  );
};

export default SelectBox;
