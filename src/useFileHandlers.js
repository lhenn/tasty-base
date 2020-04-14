import {useCallback, useEffect, useReducer, useRef} from "react";
import {getFirebase} from "./firebase";

const initalState = {
    files: [],  // files being uploaded
    pending: [],  // file being processed and number remaining
    next: null,  // next item in pending
    uploading: false,  // upload in progress?
    uploaded: {},  // object files get inserted into when uploaded
    status: "idle"  // for ui
}

// Different states
const LOADED = 'LOADED'
const INIT = 'INIT'  // use for triggering onStart
const PENDING = 'PENDING'
const FILES_UPLOADED = 'FILES_UPLOADED'
const UPLOAD_ERROR = 'UPLOAD_ERROR'

const reducer = (state, action) => {
    switch (action.type) {
        case "load":
            return {...state, files: action.files, status: LOADED};
        case "submit":
            return {...state, uploading: true, pending: state.files, status: INIT};
        case "next":
            return {
                ...state,
                next: action.next,
                status: PENDING,
            };
        case "file-uploaded":
            return {
                ...state,
                next: null,  // lets first useEffect respond
                pending: action.pending,
                uploaded: {
                    ...state.uploaded,
                    [action.prev.id]: {file: action.prev.file, downloadUrl: action.downloadUrl},
                }
            };
        case "set-upload-error":
            return {...state, uploadError: action.error, status: UPLOAD_ERROR};
        case "files-uploaded":
            return {...state, uploading: false, status: FILES_UPLOADED};
        default:
            return state;
    }
}

const logUploadedFile = (num, color = "green") => {
    const msg = `%cUploaded ${num} files.`
    const style = `color:${color};font-weight:bold;`
    console.log(msg, style)
}

// Simulate an upload promise handler
/*
const api = {
    uploadFile({timeout = 550}) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, timeout)
        })
    },
}
*/

const useFileHandlers = () => {
    const [state, dispatch] = useReducer(reducer, initalState);

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();  // ???
            if (state.files.length) {
                dispatch({type: "submit"});
            } else {
                window.alert("You have not selected any files.");
            }
        },
        [state.files.length]
    )

    const onChange = (e) => {
        if (e.target.files.length) {
            const arrFiles = Array.from(e.target.files);  // FileList -> Array
            const files = arrFiles.map((file, index) => {
                const src = window.URL.createObjectURL(file);
                return {file, id: index, src};
            });
            dispatch({type: "load", files});
        }
    };

    // Sets next file when state.next can be set again
    useEffect(() => {
        if (state.pending.length && state.next == null) {
            const next = state.pending[0];
            dispatch({type: "next", next});
        }
    }, [state.next, state.pending]);

    const countRef = useRef(0)

    // Processes the next pending thumbnail when ready
    useEffect(() => {
        if (state.pending.length && state.next) {
            const {next} = state
            let imgName = state.next.file.name;

            console.log("state.next: ", imgName);  // DEBUG

            let uploadTask = getFirebase().storage().ref().child(imgName).put(next.file);

            uploadTask.on(getFirebase().storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("upload is " + progress + "% done");
                    switch (snapshot.state) {
                        case getFirebase().storage.TaskState.PAUSED:
                            console.log("upload is paused");
                            break;
                        case getFirebase().storage.TaskState.RUNNING:
                            console.log("upload is running");
                            break;
                        default:
                            console.log("snapshot.state is ", snapshot.state);
                            break;
                    }
                }, (error) => {
                    switch (error.code) {
                        case 'storage/unauthorized':
                            console.log("User doesn't have permission to access the object");
                            dispatch({type: 'set-upload-error', error})
                            break;
                        case 'storage/canceled':
                            console.log("User canceled the upload");
                            dispatch({type: 'set-upload-error', error})
                            break;
                        default:
                            console.log("Unknown error occurred");
                            dispatch({type: 'set-upload-error', error})
                            break;
                    }
                }, () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(
                        (downloadUrl) => {
                            const prev = next
                            logUploadedFile(++countRef.current)
                            const pending = state.pending.slice(1)
                            console.log("DOWNLOAD URL: ", downloadUrl)
                            dispatch({type: 'file-uploaded', prev, pending, downloadUrl})
                        }
                    )
                }
            );
        }
    }, [state])

    // Ends uploading
    useEffect(() => {
        if (!state.pending.length && state.uploading) {
            dispatch({type: "files-uploaded"});
        }
    }, [state.pending.length, state.uploading])

    return {...state, onSubmit, onChange};
}

export default useFileHandlers
