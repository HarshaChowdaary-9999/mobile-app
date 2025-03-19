import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import {DataTable, TextInput} from "react-native-paper"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import ManageMonthlyView from '../manageMonthlyView';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import FontAwesome from '@expo/vector-icons/FontAwesome';

import AntDesign from '@expo/vector-icons/AntDesign';
import {DatePickerInput } from "react-native-paper-dates";
import { useRouter } from 'expo-router';

const Group = ({selectedGroupID=[],customerID=''}) => {
  const [groups, setGroup] = useState([]);
  const [groupDrop,setGroupDrop]=useState({});
  const [createGroup,setCreateGroup] = useState(false)
  const [inputGroupName,setInputGroupName] = useState("")
  const [startinputDate, setStartInputDate] = useState(undefined)
  const [endinputDate,setEndInputDate]=useState(undefined)
  const [manageGroupButton,setManageGroupButton] = useState(true)
 
  const router=useRouter();
  const handleDropDown =(id)=>{
    setGroupDrop((prevState)=>({
      ...prevState,
      [id]: !prevState[id]
    }))   

  }

  const sendCreateGroupData =async()=>{
    try{
      if(inputGroupName && startinputDate &&endinputDate){
        try{
        const addGroup = await fetch(`http://10.0.2.2:4000/group/createGroup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            groupName:inputGroupName,
            startDate:startinputDate,
            endDate  :endinputDate
          }),
        });
        if (addGroup.ok){
          const data = await addGroup.json();
          if(data.success){
            setCreateGroup(false)
            setInputGroupName("")
            setStartInputDate(undefined)
            setEndInputDate(undefined)
          }else{
            throw new Error("Failed");
          }
        }
      
      
      }catch(error){
          console.log("An error occurred when creating new group date");
          
        }

      }

    }catch (error) {
        console.error('Error at sending create group:', error);
      }
  }


  useEffect(() => {
    const fetchGroupData = async () => {
     
      try {
        const response = await fetch('http://10.0.2.2:4000/group/fetchGroups');
        if (response.ok) {
          const data = await response.json();
          let groupsData = data['data']; 
          
          if (selectedGroupID.length>0){
            const selectedGroupIDs = selectedGroupID.map(group => group.groupID);

            const finalData = groupsData.filter(item => selectedGroupIDs.includes(item._id));

            setGroup(finalData)
            setManageGroupButton(false)

          }else{
            setManageGroupButton(true)
          setGroup(groupsData);

          }
          //console.log("Fetched Data:", JSON.stringify(groupsData, null, 2));
        } else {
          console.error('Failed to fetch groups:', response.status);
        }
        
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    fetchGroupData();
  },[selectedGroupID]);
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {!createGroup && groups.length > 0 ? (
          groups.map((group) => (
            <View key={group._id} style={styles.cardHead}>
              <View key={group._id} style={styles.card}>
              <Text style={styles.title}>{group.groupName}</Text>
              <View style={styles.rightView}>
                <FontAwesome5 name="user-edit" size={24}  color="white" style={{marginRight:15}} onPress={()=> router.push({pathname:'/manageGroup',params:{id:group._id}})} />
              <AntDesign key={group._id} name={groupDrop[group._id] ? "caretup" : "caretdown"} size={24} color="white" onPress={()=>handleDropDown(group._id)} />
              </View>
              </View>
              {groupDrop[group._id] && manageGroupButton && (
                <View style={styles.dropdown}>
                  <DataTable style={styles.table}>
                  <DataTable.Header style={styles.tableHeader}>
                    <DataTable.Title style={styles.column}>Month</DataTable.Title>
                    <DataTable.Title style={styles.column}>Amt</DataTable.Title>
                    <DataTable.Title style={styles.column}>Total</DataTable.Title>
                    
                    <DataTable.Title style={styles.column}>Collected</DataTable.Title>
                    
                    <DataTable.Title style={styles.column}>TakenBy</DataTable.Title>
                    <DataTable.Title style={styles.column}>View</DataTable.Title>
                  </DataTable.Header>
                  {group.monthly?.map((month)=>(
                    <DataTable.Row key={month._id}>
                    <DataTable.Cell style={styles.column}>{month.month}</DataTable.Cell>
                    <DataTable.Cell>{month.amount}</DataTable.Cell>
                    <DataTable.Cell>{month.amount*20}</DataTable.Cell>
                    <DataTable.Cell>{month.amountReceived}</DataTable.Cell>
                    <DataTable.Cell>Deepu</DataTable.Cell>
                    <DataTable.Cell><MaterialIcons name ="open-in-full" onPress={()=>router.push({pathname:'/manageMonth',params:{groupID:group._id,monthID:month._id}})}/></DataTable.Cell>
                  </DataTable.Row>
                    
                  ))}

                  </DataTable>
                  
                </View>
              )}
              {
                groupDrop[group._id] && !manageGroupButton && (
                    <ManageMonthlyView customerID={customerID} groupID={group._id}/>
                )
              }
            </View>
            

          ))
        ) : (
          <View>
            <TouchableOpacity onPress={()=>setCreateGroup(!createGroup)}>
            <View style={styles.close}>
              <FontAwesome name="close" size={25}/>
            </View>
            </TouchableOpacity>
            <View style={styles.form}>
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter group name"
              value={inputGroupName}              
              onChangeText={setInputGroupName}
            />  
            <Text style={styles.label}>Start Date</Text>
            <DatePickerInput
              locale="en"
              label="Start Date"
              value={startinputDate}
              onChange={(d) => setStartInputDate(d)}
              inputMode="start"
            />
             <Text style={styles.label}>End Date</Text>
              <DatePickerInput
                locale="en"
                label="End Date"
                value={endinputDate}
                onChange={(d) => setEndInputDate(d)}
                inputMode="start"
              />
              </View>

          </View>
        )}
        {manageGroupButton && 
        <TouchableOpacity onPress={createGroup ? sendCreateGroupData:()=>setCreateGroup(!createGroup)}>
          <View style={styles.button}><Text style={[styles.title,{padding:10}]}> {createGroup ? "Done":(<><FontAwesome6 name ="plus" size="20"/> CreateGroup</>)}</Text></View>
        </TouchableOpacity>
}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: 'seashell',
    flex: 1,
    padding: 10,
    marginBottom:40,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'goldenrod',
    marginTop:10
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: 'gray',
  },
  cardHead:{
    flexDirection: 'column',
  },
  dropdown:{
    flex: 1,
    flexDirection: 'column',
    justifyContent:"space-between"

  },
  monthcard:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'godlenrod',
    paddingHorizontal: 10,
  },
  tableHeader:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  table:{
    flex:1,
    width:"100%"
  },
  column:{
    flex:1,
    textAlign: 'center',
  },
  button:{
    backgroundColor: 'goldenrod',
    borderRadius:10, 
    alignSelf: "flex-start",
    position:"absolute",
    right:0
  },
  label:{
    fontSize:16,
    fontWeight: "bold",
    marginVertical:10
  },
  close:{
    position:"absolute",
    right:0,
  },
  form:{
    marginTop:15

  },
  rightView:{
    flexDirection:"row",
    justifyContent:"space-between",
  }
});

export default Group;
