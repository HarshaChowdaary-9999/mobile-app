import { View, Text, ScrollView, FlatList, TouchableOpacity,StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import SearchTab from '../../components/searchTab'
import Group from './groupWise'
const search = () => {
  const [enteredName,setEnterName]=useState('')
  const [searchData,setSearchData]=useState([])
  const [selectedCustomer,setSelectedCustomer]=useState()

  const handleSearch =(name)=>{
    
    setEnterName(name)   
  }
  //console.log(selectedCustomer);
  
  useEffect(()=>{
    const CustomerSearch =async()=>{
      const data = await fetch(`http://10.0.2.2:4000/customer/searchCustomer/${enteredName}`)
      if (data.ok){
        const data1=await data.json()        
        setSearchData(data1['data'])
        
        
      }
    
    }
    CustomerSearch()
  },[enteredName])
  return (
    <View style={{marginBottom:120}}>
      <View>
        <View>
          <SearchTab placeholder="Search By Customer" onsearch={handleSearch} />
          <View>
          {enteredName.length>1 &&  searchData.length > 0 && (
            <FlatList
            data={searchData}
            renderItem={({item})=><TouchableOpacity onPress={()=>setSelectedCustomer(item)}><Text style={styles.title} >{item.customerName}</Text></TouchableOpacity>}
            keyExtractor={item => item._id}
            style={{height:60,marginLeft:15,position:'relative'}}

            />
          )}
          </View>
        </View>
      </View>
      <ScrollView>
        {selectedCustomer && (
          <View style={styles.holder}>
          <View>
            <View style={styles.infoHolder}>
              <Text style={styles.infoTitle}>Customer Name : </Text>
              <Text style={styles.infoData}>{selectedCustomer.customerName}</Text>              
            </View>
            <View style={styles.infoHolder}>
              <Text style={styles.infoTitle} >Phone Number : </Text>
              <Text style={styles.infoData} >{selectedCustomer.contactNo}</Text>              
            </View>
            <View style={styles.infoHolder}>
              <Text style={styles.infoTitle} >Address           : </Text>
              <Text style={styles.infoData} >{selectedCustomer.address}</Text>              
            </View>
            <View style={styles.infoHolder}>
              <Text style={styles.infoTitle} >Total Groups : </Text>
              <Text style={styles.infoData} >{selectedCustomer.groups.length}</Text>              
            </View>
            <View style={styles.infoHolder}>
              <Text style={styles.infoTitle} >Debt Amount : </Text>
              <Text style={styles.infoData} >{selectedCustomer.debt}</Text>              
            </View>
          </View>
          <Group selectedGroupID={selectedCustomer.groups} customerID={selectedCustomer._id}/>




        </View>
        )}

      </ScrollView>
      
    </View>
  )
}
const styles=StyleSheet.create({
  title:{
    fontSize:20,
    fontWeight:"500",
    borderBottomWidth:0.3,
    borderBottomColor:"black",
  },
  infoHolder:{
    flexDirection:"row",
    justifyContent:"space-between",
    padding:5
  },
  holder:{
    margin:30,
  },
  infoTitle:{
    fontSize:20,
    fontWeight:"500"
  },
  infoData:{
    fontSize:18,
    fontWeight:"500"
  }
})

export default search