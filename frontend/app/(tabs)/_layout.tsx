import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen name='groupWise' options={{
        title:'Groups',
        tabBarIcon: ({color}) => <FontAwesome name="group" size={24} color="black" />

       }}/>
      <Tabs.Screen name='search' options={{title:'Find', tabBarIcon:({color}) => <FontAwesome name="search" size={24} color="black" /> }}/>      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen name='dept' options={{title:'Dept', 
        tabBarIcon: ({color})=><MaterialCommunityIcons name="account-cash" size={24} color="black" />

      }} />
      <Tabs.Screen
        name="paymentLogs"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <FontAwesome6 name="money-bill-transfer" size={24} color="black" />,
        }}
      />
    </Tabs>
  );
}
