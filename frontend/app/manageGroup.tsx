import { View, Text, ScrollView,StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {DataTable, TextInput} from "react-native-paper"
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Dropdown} from "react-native-element-dropdown" //npm install react-native-element-dropdown


const manageGroup = () => {
  const {id}=useLocalSearchParams()
  const [groupName,setGroupName]=useState("")
  const [totalAmount,setTotalAmount]=useState()
  const [totalAmountPerCustomer,setTotalAmountPerCustomer]=useState()
  const [paymentInfo,setPaymentInfo]=useState([])
  const [collectedAmount,setCollectedAmount]=useState()
  const [totalCustomers,setTotalCustomers]=useState()
  const [addCustomerFlag,setAddCustomerFlag]=useState(false)
  const [customerList,setCustomerList]=useState([])
  const [selectedName,setSelectedName]=useState('')
  const [flagDone,setFlagDone]=useState(false)
  const [addMonthFlag,setAddMonthFlag]=useState(false)

  //new month
  const [monthName,setMonthName]=useState('')
  const [monthAmount,setMonthAmount]=useState('')
  useEffect(()=>{
    const fetchData =async()=>{
      try{
        const fetchgroupdata = await fetch(`http://localhost:4000/group/groupViewHelper/${id}`)
        console.log(id);
        
        if (fetchgroupdata.ok){
          const data =await fetchgroupdata.json()
          setGroupName(data['groupName'])
          setTotalAmount(data['totalAmount'])
          setTotalAmountPerCustomer(data['totalAmountPerCustomer'])
          setPaymentInfo(data['paymentInfo'])
          setCollectedAmount(data['collectedAmount'])
          setTotalCustomers(data['totalCustomers'])
          
        }else{
          console.log("couldn't fetch group data");
          
        }
      }catch(e){
        console.log("error at fetching group data",e);
        
        
      }
    }
    fetchData()
  },[])
  useEffect(()=>{
    const customerSearch = async()=>{
      const customerList = await fetch("http://localhost:4000/customer/listCustomer")
      if (customerList.ok){
        const data = await customerList.json()
        const data1= data['data']
        
        setCustomerList(data1)
        

      }
    }
    customerSearch()
  },[addCustomerFlag])

  const sendNewMonth=async()=>{
    try{
      console.log(monthName,monthAmount);
      
      const sendingData = await fetch("http://localhost:4000/group/addMonth",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          month:monthName,
          amount:monthAmount,
          groupID:id
        })
      })
      if (sendingData.ok){
        const data=await sendingData.json()

        
        
        if (data['success']){
          console.log("New Month was added successfully" , data['message']);
          setMonthName('')
          setMonthAmount('')
          
        }else{
          console.log("Issue at adding month",data['message']);
          
        }
      }

    }catch(error){
      console.log("error at sending new month",error);
      
    }
  }

  const sendAddcustomer=async()=>{
    try{
      console.log("slected Name,id",selectedName,id);
      
      const senddata=await fetch(`http://localhost:4000/group/addCustomerToGroup`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer:selectedName,
          group:id
        })
      })
      
      if (senddata.ok){
        const data=await senddata.json()
        if(data.message){
          setSelectedName('')     
          
      }
      else{
        console.log("Issue at adding customer");
        
      }

    }
  }catch(error){
      console.log("error at adding customer",error);
      
    }
  }

  return (
    <ScrollView>
     <View style={[{ opacity: addCustomerFlag ? 0.3 : 1 },{
    marginBottom:40,}]}>
     <View style={styles.contents}>
      <View style={{width:"80%",marginLeft:15}}>
        <View style={[styles.contentView,{backgroundColor:"white"}]}>
          <Text style={styles.contentHeader}>GroupName : </Text>
        <Text style={styles.contentdata}>
          {groupName}
        </Text>
        </View>
        <View style={styles.contentView}>
        <Text style={styles.contentHeader}>Total Amount :</Text>
        <Text style={styles.contentdata}>{totalAmount}</Text>
        </View>
        <View style={[styles.contentView,{backgroundColor:"white"}]}>
        <Text style={styles.contentHeader}>Collected Amount :</Text>
        <Text style={styles.contentdata}>{collectedAmount}</Text>
        </View>
        <View style={styles.contentView}>
        <Text style={styles.contentHeader}>Total Customers :</Text>
        <Text style={styles.contentdata}>{totalCustomers}</Text>
        </View>
        </View>
        <View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title ><Text style={styles.tableTitle}>Name</Text></DataTable.Title>
              <DataTable.Title><Text style={styles.tableTitle}>Total Amount</Text></DataTable.Title>
              <DataTable.Title><Text style={styles.tableTitle}>Paid Amount</Text></DataTable.Title>
              <DataTable.Title><Text style={styles.tableTitle}>View</Text></DataTable.Title>
            </DataTable.Header>
            {
              paymentInfo.map((payment)=>(
                <DataTable.Row key={payment["_id"]}>
                  <DataTable.Cell>{payment["customerName"][0]}</DataTable.Cell>
                  <DataTable.Cell>{totalAmountPerCustomer}</DataTable.Cell>
                  <DataTable.Cell>{payment['totalPayment']}</DataTable.Cell>
                  <DataTable.Cell>"temp"</DataTable.Cell>
                </DataTable.Row>
              ))
            }
          </DataTable>
        </View>
        </View>
      </View>
      {addCustomerFlag && (
        <View style={styles.addCustomerStyle}>
          <View style={styles.close}>
          <FontAwesome name="close" size={25} onPress={()=>{setAddCustomerFlag(!addCustomerFlag)}}/>
          </View>
          <View style={styles.dropdown}>
            <Dropdown
            data={customerList}
            labelField="customerName"
            valueField="_id"
            placeholder="select option"
            search
            searchPlaceholder="Search..."
            value={selectedName}
            onChange={item=>setSelectedName(item._id)}
            

            
            />
            </View>
            

        </View>
      )}
      {addMonthFlag &&(
        <View style={styles.addCustomerStyle}>
          <View style={styles.close}>
          <FontAwesome name="close" size={25} onPress={()=>{setAddMonthFlag(!addMonthFlag)}}/>
          </View>
          <View style={styles.inputContent}>
            <Text>Month Name :</Text>
            <TextInput 
            value={monthName} 
            onChangeText={setMonthName}/>
          </View>
          <View>
            <Text>Amount :</Text>
            <TextInput 
            value={monthAmount}
            onChangeText={setMonthAmount}/>
          </View>
          <Text style={{color:"white"}}>{addMonthFlag}</Text>
        </View>
      )}
      { !addCustomerFlag &&(
      <TouchableOpacity onPress={addMonthFlag? sendNewMonth:()=>setAddMonthFlag(!addMonthFlag)}>
        <View style={styles.button1}>
          <Text style={[styles.title,{padding:10}]} >{addMonthFlag ? "Done":<><FontAwesome6 name ="plus" size="20"/>Add Month </>}</Text>
        </View>
        
      </TouchableOpacity>
        )
      }
      {!addMonthFlag &&(
      <TouchableOpacity onPress={addCustomerFlag ? sendAddcustomer:()=>{setAddCustomerFlag(!addCustomerFlag)}} >
          <View style={styles.button}><Text style={[styles.title,{padding:10}]}>{addCustomerFlag ?"Done" :(<><FontAwesome6 name ="plus" size="20"/>Add Customer </>)}</Text></View>
      </TouchableOpacity>)
}
      

    </ScrollView>
  );
};
const styles=StyleSheet.create({
  contentView:{
    flex: 1,
    flexDirection:'row',
    justifyContent:"space-between",
    padding:5,
  },
  button:{
    backgroundColor: 'goldenrod',
    borderRadius:10, 
    alignSelf: "flex-start",
    position:"absolute",
    right:0
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  addCustomerStyle:{
    position: "absolute",
    top:"30%",
    height:"70%",
    width:"90%",
    marginHorizontal:10,
    alignContent:"center",
    backgroundColor:"goldenrod",
    borderRadius:10,
  },
  close:{
    position:"absolute",
    right:0,
    padding:10
  },
  dropdown:{
    width:"80%",
    padding:10
  },
  contents:{
    padding:10
  },
  contentHeader:{
    fontSize:20,
    fontWeight:"bold",

  },
  contentdata:{
      fontSize:17,
      fontWeight:"semibold"
  },
  tableTitle:{
    fontWeight:"bold",
    fontSize:13,
  },
  button1:{
    backgroundColor: 'goldenrod',
    borderRadius:10, 
    alignSelf: "flex-start",
    position:"absolute",
    left:0
  },
  inputContent:{
    marginTop:30,
  }
  
})

export default manageGroup;
