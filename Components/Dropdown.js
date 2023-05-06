import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
// import { setLang } from '../slices/langSlices';

const data = [
  { label: 'Python', value: 'python' },
  { label: 'Javascript', value: 'javascript' },
  { label: 'Java', value: 'java' },
  { label: 'C', value: 'c' },
  { label: 'C++', value: 'cpp' },
  // { label: 'Item 6', value: '6' },
  // { label: 'Item 7', value: '7' },
  // { label: 'Item 8', value: '8' },
];

const DropdownComponent = () => {
  const [value, setValue] = useState(null);

  const dispatch = useDispatch()
  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Select Language"
      searchPlaceholder="Search..."
      value={value}
    // onChange={item => {
    //   setValue(item.value);
    //   dispatch(setLang({ value }))
    // }}
    // renderLeftIcon={() => (
    //   // <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
    //   <Text>Language</Text>
    // )}
    />
  );
};


export default DropdownComponent;
const styles = StyleSheet.create({
  dropdown: {
    marginBottom: 5,
    marginHorizontal: 16,
    height: 15,
    width: '40%',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 22,
    marginBottom: 7
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});