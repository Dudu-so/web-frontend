import {get, post, put, deletes } from "./http";
export const getDocTable = formData => get('/externalRegulation/gain', formData);

export const login = formData => post("/identify/login",formData,'application/json;charset=UTF-8');

export const register=formData=>post("/identify/register",formData,'application/json;charset=UTF-8');

export const logout=()=>get("/identify/logout");

export const searchRequest=(param)=>post("/externalRegulation/search",param,'application/json;charset=UTF-8');

export const docDownLoadByID=formData=>get("/externalRegulation//downloadFile",formData,'blob');

export const getStatistics = () => get("/externalRegulation/statistics");

export const abolishDocPUBLISHED=formData=>post("/externalRegulation/abolish",formData,'multipart/form-data');

export const deleteDocUNPUBLISHED=formData=>post("/externalRegulation/delete",formData,'multipart/form-data');

export const issueDocUNPUBLISHED=formData=>post("/externalRegulation/issue",formData,'multipart/form-data');

export const editDocUNPUBLISHED=formData=>post("/externalRegulation/edit",formData,'multipart/form-data;boundary=none');

export const createNewDoc=formData=>post("/externalRegulation/create",formData,'multipart/form-data;boundary=none');