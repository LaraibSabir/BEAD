/**
 * @format
 */

import React from "react";
import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./assets/Forms/Login";
import StudentDashboard from "./assets/Forms/Student/StudentDashboard";
import LastSemStudentDashboard from "./assets/Forms/Student/LastSemStudentDashboard";
import StudentQuestionsDashboard  from "./assets/Forms/Student/StudentQuestionsDashboard";
import ConfidentalStudentEvaluationForm from "./assets/Forms/Student/ConfidentalStudentEvaluationForm";
import ConfidentailQuestionsDashboard from "./assets/Forms/Student/ConfidentialQuestionsDashboard";

 import PeerEvalutors from "./assets/Forms/Teacher/PeerEvalutors";
import TeacherDashboard_HOD from "./assets/Forms/Teacher/TeacherDashboard_HOD";
import NotPeerEvaluators from "./assets/Forms/Teacher/NotPeerEvaluators";

import CHR from "./assets/Forms/Teacher/CHR";
import Attendance from "./assets/Forms/Teacher/Attedance";
import EvaluationRates from "./assets/Forms/Teacher/EvaluationRate";
import PeerAssignment from "./assets/Forms/Teacher/PeerAssignment";
 import EvaluateTeachers from "./assets/Forms/Teacher/EvaluateTeachers";
 import TeacherEvalutionQuestions from "./assets/Forms/Teacher/TeacherEvalutionQuestions";

import DirectorDashboard  from "./assets/Forms/Director/DirectorDashboard";
import TeacherPerformanceDashboard from "./assets/Forms/Director/TeacherPerfomance/TeacherPerformanceDashboard";
import RCEvaluation from "./assets/Forms/Director/TeacherPerfomance/RCEvaluation";
import AllAssignedCourseTeachers from "./assets/Forms/Director/TeacherPerfomance/AllAssignedCourseTeachers";
import ConfidentialDecryptor from "./assets/Forms/Director/ConfidentialDecryptor";
import ConfidentialDecryptorTable from "./assets/Forms/Director/ConfidentialDecryptorTable";
import CompareScreenFrom_C_T from "./assets/Forms/Director/TeacherPerfomance/CompareScreenFrom_C_T"
const Stack = createNativeStackNavigator();
const Root = () => {
  return (
    <NavigationContainer>
      <MainStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <MainStack.Screen name="Login" component={Login} />
        {/* Student */}
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        <Stack.Screen name="LastSemStudentDashboard" component={LastSemStudentDashboard}/>
        <Stack.Screen name="ConfidentalStudentEvaluationForm"  component={ConfidentalStudentEvaluationForm} />
        <Stack.Screen name="StudentQuestionsDashboard" component={StudentQuestionsDashboard} />
        <Stack.Screen name="ConfidentailQuestionsDashboard" component={ConfidentailQuestionsDashboard} />


        {/* Teacher */}
       <Stack.Screen name="PeerEvalutors" component={PeerEvalutors}/>

       <Stack.Screen name="TeacherDashboard_HOD" component={TeacherDashboard_HOD}/>
       <Stack.Screen name="EvaluateTeachers" component={EvaluateTeachers}/>
       <Stack.Screen name="TeacherEvalutionQuestions" component={TeacherEvalutionQuestions}/>
       <Stack.Screen name="NotPeerEvaluators" component={NotPeerEvaluators}/>
       <Stack.Screen name="PeerAssignment"  component={PeerAssignment} />
       <Stack.Screen name="CHR" component={CHR} />
       <Stack.Screen name="Attendance" component={Attendance} />
       <Stack.Screen name="EvaluationRates" component={EvaluationRates} />
       

      <MainStack.Screen name="DirectorStack" component={DirectorStack} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

const MainStack = createNativeStackNavigator();
const DirectorSubStack = createNativeStackNavigator(); // Separate instance

const DirectorStack = () => {
  return (
    <DirectorSubStack.Navigator screenOptions={{ headerShown: false }}>
      <DirectorSubStack.Screen name="DirectorDashboard" component={DirectorDashboard}/>
      <Stack.Screen name="RCEvaluation" component={RCEvaluation}/>
      <Stack.Screen name="AllAssignedCourseTeachers" component={AllAssignedCourseTeachers}/>
      <Stack.Screen name="CompareScreenFrom_C_T" component={CompareScreenFrom_C_T}/>
      <Stack.Screen name="ConfidentialDecryptor" component={ConfidentialDecryptor}/>
      <Stack.Screen name="ConfidentialDecryptorTable" component={ConfidentialDecryptorTable}/>
    
    </DirectorSubStack.Navigator>
  );
};

AppRegistry.registerComponent(appName, () => Root);