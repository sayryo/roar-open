import React from 'react';

const ImagePreview = (props) => {
    return(
        <div onClick={() => props.delete(props.id)}>
            <img
                alt="プレビュー"
                src={props.path}
            />
        </div>
    )
}

export default ImagePreview;