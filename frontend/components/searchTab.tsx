import { View, Text,TextInput,StyleSheet } from 'react-native'
import React, { useState } from 'react'

const searchTab = ({placeholder,onsearch}) => {
  const [searchValue,setSearchValue] = useState('')
  const handleOnChange =(value)=>{
    setSearchValue(value)
    onsearch(value)
    

  }
  return (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
        placeholder={placeholder || "Search"}
        value={searchValue}
        onChangeText={handleOnChange}
        style={styles.inputStyle}
        
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  inputStyle:{
    fontSize:20,
    borderColor:"black",
    borderBottomWidth:1,
    fontcolor:"black",

  },
  inputContainer:{
    padding:10
    
  },
})

export default searchTab