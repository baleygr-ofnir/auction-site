import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { UserService } from '../services/UserService';
import type { UserLoginRequest, UserLoginResponse, UserRegisterRequest } from '../types/Types';