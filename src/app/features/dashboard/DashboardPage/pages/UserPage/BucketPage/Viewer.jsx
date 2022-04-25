import React,{useEffect} from 'react'
import { initializeViewer } from '../../../../../../../helpers/forge-viewer'


function Viewer() {
    const urn ='dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRtaW4tMjAyMjA0MjEwMjM0MjEtdGVzdC9zYW1wbGUucnZ0'
    useEffect(() => {
        initializeViewer(urn)
    }, [])

    return (
        <div>
            <div id='viewerContainer' style={{height: 500}}></div>
        </div>
        )
}

export default Viewer