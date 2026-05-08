/**
 * @format
 */

import React from "react";
import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./assets/Forms/Login";

// Student
import StudentDashboard from "./assets/Forms/Student/StudentDashboard";
import LastSemStudentDashboard from "./assets/Forms/Student/LastSemStudentDashboard";
import StudentQuestionsDashboard  from "./assets/Forms/Student/StudentQuestionsDashboard";
import ConfidentalStudentEvaluationForm from "./assets/Forms/Student/ConfidentalStudentEvaluationForm";
import ConfidentailQuestionsDashboard from "./assets/Forms/Student/ConfidentialQuestionsDashboard";

//Evaluators
import PeerEvalutors from "./assets/Forms/Teacher/PeerEvalutors";
import TeacherDashboard_HOD from "./assets/Forms/Teacher/TeacherDashboard_HOD";
import NotPeerEvaluators from "./assets/Forms/Teacher/NotPeerEvaluators";

//Teachers
import CHR from "./assets/Forms/Teacher/CHR";
import Attendance from "./assets/Forms/Teacher/Attedance";
import EvaluationRates from "./assets/Forms/Teacher/EvaluationRate";
import PeerAssignment from "./assets/Forms/Teacher/PeerAssignment";
import EvaluateTeachers from "./assets/Forms/Teacher/EvaluateTeachers";
import TeacherEvalutionQuestions from "./assets/Forms/Teacher/TeacherEvalutionQuestions";

//Director
import DirectorDashboard  from "./assets/Forms/Director/DirectorDashboard";
import TeacherPerformanceDashboard from "./assets/Forms/Director/TeacherPerfomance/TeacherPerformanceDashboard";
import RCEvaluation from "./assets/Forms/Director/TeacherPerfomance/RCEvaluation";
import ConfidentialDecryptor from "./assets/Forms/Director/ConfidentialDecryptor";
import ConfidentialDecryptorTable from "./assets/Forms/Director/ConfidentialDecryptorTable";
import CompareScreenFrom_C_T from "./assets/Forms/Director/TeacherPerfomance/CompareScreenFrom_C_T";
import AddStudentEvalQuestions from "./assets/Forms/Director/Questions/AddStudentEvalQuestions";

import GenderAnalytics from "./assets/Forms/Director/GenderAnalytics";

// Declare navigators BEFORE using them
const MainStack = createNativeStackNavigator();
const DirectorSubStack = createNativeStackNavigator();

const DirectorStack = () => {
  return (
    <DirectorSubStack.Navigator screenOptions={{ headerShown: false }}>
      <DirectorSubStack.Screen name="DirectorDashboard" component={DirectorDashboard}/>
      <DirectorSubStack.Screen name="RCEvaluation" component={RCEvaluation}/>
      <DirectorSubStack.Screen name="TeacherPerformanceDashboard" component={TeacherPerformanceDashboard}/>
      <DirectorSubStack.Screen name="CompareScreenFrom_C_T" component={CompareScreenFrom_C_T}/>
      <DirectorSubStack.Screen name="ConfidentialDecryptor" component={ConfidentialDecryptor}/>
      <DirectorSubStack.Screen name="ConfidentialDecryptorTable" component={ConfidentialDecryptorTable}/>
      <DirectorSubStack.Screen name="AddStudentEvalQuestions" component={AddStudentEvalQuestions}/>
      <DirectorSubStack.Screen name="GenderAnalytics" component={GenderAnalytics}/>

    </DirectorSubStack.Navigator>
  );
};

const Root = () => {
  return (
    <NavigationContainer>
      <MainStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <MainStack.Screen name="Login" component={Login} />

        {/* Student */}
        <MainStack.Screen name="StudentDashboard" component={StudentDashboard} />
        <MainStack.Screen name="LastSemStudentDashboard" component={LastSemStudentDashboard}/>
        <MainStack.Screen name="ConfidentalStudentEvaluationForm" component={ConfidentalStudentEvaluationForm} />
        <MainStack.Screen name="StudentQuestionsDashboard" component={StudentQuestionsDashboard} />
        <MainStack.Screen name="ConfidentailQuestionsDashboard" component={ConfidentailQuestionsDashboard} />

        {/* Teacher */}
        <MainStack.Screen name="PeerEvalutors" component={PeerEvalutors}/>
        <MainStack.Screen name="TeacherDashboard_HOD" component={TeacherDashboard_HOD}/>
        <MainStack.Screen name="EvaluateTeachers" component={EvaluateTeachers}/>
        <MainStack.Screen name="TeacherEvalutionQuestions" component={TeacherEvalutionQuestions}/>
        <MainStack.Screen name="NotPeerEvaluators" component={NotPeerEvaluators}/>
        <MainStack.Screen name="PeerAssignment" component={PeerAssignment} />
        <MainStack.Screen name="CHR" component={CHR} />
        <MainStack.Screen name="Attendance" component={Attendance} />
        <MainStack.Screen name="EvaluationRates" component={EvaluationRates} />

        {/* Director (nested sub-stack) */}
        <MainStack.Screen name="DirectorStack" component={DirectorStack} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

AppRegistry.registerComponent(appName, () => Root);