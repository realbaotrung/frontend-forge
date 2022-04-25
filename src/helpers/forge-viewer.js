import { api } from '../api/axiosClient';
/* global Autodesk, THREE */

// Get token from server
const getToken = async () => {
    const {data} = await api.get('/forge/oauth/token-2-legged');
    return data?.access_token
}

export const initializeViewer = async (urn) => {
const token = await getToken()

const viewerOptions = {
    env: 'AutodeskProduction',
    accessToken: token,
    api: 'derivativeV2',
};

const viewerContainer = document.getElementById('viewerContainer')
const viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerContainer, {})

Autodesk.Viewing.Initializer(viewerOptions, () => {
    viewer.start();
    Autodesk.Viewing.Document.load(`urn:${urn}`, (doc) =>{
        const defaultModel = doc.getRoot().getDefaultGeometry();
        viewer.loadDocumentNode(doc, defaultModel);
    })
  })
}