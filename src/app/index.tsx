import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'expo-router';

import useAuth from '@/hooks/useAuth';


const Index = () => {
  const { isUserLoggedIn } = useAuth();

  if (isUserLoggedIn) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/welcome" />;
};

export default Index;
