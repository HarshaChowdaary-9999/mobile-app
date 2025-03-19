import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'

const ManageMonthlyView = ({customerID,groupID}) => {
  const [fetcheddata,setFetchedData]=useState([])
  useEffect(()=>{
    const fetchData =async () =>{
      try{
        const fetchData = await fetch(`http://10.0.2.2:4000/customer/customerStats/${customerID}/${groupID}`)
        
        
        if (fetchData.ok){
          const data = await fetchData.json()
          const data1 = data['data']
          
          setFetchedData(data1)


          
        }
      }catch(Error){
        console.log("error at fetching data in manageMonthlyView",Error);
        
    }}
    fetchData()
  
  },[customerID,groupID])
  
  return (
    <View>
      <View>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Month</DataTable.Title>
            <DataTable.Title>Amount</DataTable.Title>
            <DataTable.Title>paid Amount</DataTable.Title>
            <DataTable.Title>Balance</DataTable.Title>
            <DataTable.Title>View</DataTable.Title>
          </DataTable.Header>
          {fetcheddata.length > 0 && fetcheddata.map((fdata)=>(
            <DataTable.Row key={fdata.monthID}>
              <DataTable.Cell>{fdata.month}</DataTable.Cell>
              <DataTable.Cell>{fdata.monthAmount}</DataTable.Cell>
              <DataTable.Cell>{fdata.paidAmount}</DataTable.Cell>
              <DataTable.Cell>{fdata.monthAmount - fdata.paidAmount}</DataTable.Cell>
              <DataTable.Cell><Text>Deepu</Text></DataTable.Cell>


            </DataTable.Row>
          ))
          }
        </DataTable>
      </View>
    </View>
  )
}

export default ManageMonthlyView