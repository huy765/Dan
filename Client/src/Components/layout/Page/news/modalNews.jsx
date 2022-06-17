import React, { useState, useEffect } from "react";
import { Modal, Button, InputNumber, Descriptions } from "antd";
import { Layout } from "antd";
import { Image } from "antd";
import HTMLReactParser from "html-react-parser";
import axios from "axios";
import comment from "./Style/comment.css"

import { Avatar, Comment, Form, Input, List } from 'antd';
import { Tooltip } from 'antd';
import moment from 'moment';
const { TextArea } = Input;

//comment form 

const CommentList = ({ comments }) => (
    <List
      dataSource={comments}
      header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
      itemLayout="horizontal"
      renderItem={(props) => <Comment {...props} />}
    />
  );
  
  const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
      <Form.Item>
        <TextArea rows={4} onChange={onChange} value={value} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
          Add Comment
        </Button>
      </Form.Item>
    </>
  );

  //data comment 
  const data = [
    {
      actions: [<span key="comment-list-reply-to-0">Reply to</span>],
      author: 'Han Solo',
      avatar: 'https://joeschmoe.io/api/v1/random',
      content: (
        <p>
          đây là comment 1
        </p>
      ),
      datetime: (
        <Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
          <span>{moment().subtract(1, 'days').fromNow()}</span>
        </Tooltip>
      ),
    },
    {
      actions: [<span key="comment-list-reply-to-0">Reply to</span>],
      author: 'Han Solo',
      avatar: 'https://joeschmoe.io/api/v1/random',
      content: (
        <p>
          đây là comment 2
        </p>
      ),
      datetime: (
        <Tooltip title={moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')}>
          <span>{moment().subtract(2, 'days').fromNow()}</span>
        </Tooltip>
      ),
    },
  ];

const ModalNews = ({ visible, onClose, news }) => {
    const [inputNews, setInputNew] = useState([]);

    useEffect(async () => {
        const result = await axios.get(
            `http://localhost:8080/api/news/getNews/${news}`
        );
        setInputNew(result.data.news);
    }, [news]);

    const [comments, setComments] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        if (!value) return;
        setSubmitting(true);
        setTimeout(() => {
          setSubmitting(false);
          setValue('');
          setComments([
            ...comments,
            {
              author: 'Han Solo',
              avatar: 'https://joeschmoe.io/api/v1/random',
              content: <p>{value}</p>,
              datetime: moment().fromNow(),
            },
          ]);
        }, 1000);
      };
    
      const handleChange = (e) => {
        setValue(e.target.value);
      };
    
    return (
        <>
            <Modal
                centered
                visible={visible}
                onCancel={onClose}
                width={1300}
                footer={[]}
            >
                <div className='detailProduct'>
                    <div className='itemRight'>
                        <div>
                            <h2 className='nameNews'>
                                {inputNews.length > 0
                                    ? inputNews[0].nameNews
                                    : ""}
                            </h2>
                        </div>
                    </div>
                </div>
                <strip></strip>
                <div className='detail-more-Product'>
                    <div>
                        <h2 className='title-detail'>Chi tiết tin</h2>
                        {inputNews.length > 0
                            ? HTMLReactParser(`${inputNews[0].content}`)
                            : ""}
                    </div>
                    {/* <div>
                        <h1 className="comment">Bình luận</h1>
                        <div className="input-comment">
                            <textarea rows="4" cols="130" name="comment" form="usrform"></textarea>
                            <input type="submit" className="submit"></input>
                        </div>
                    </div> */}
                    <div>
                        <h1 className="comment">Bình luận</h1>
                        {comments.length > 0 && <CommentList comments={comments} />}
                        <Comment
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
                            content={
                            <Editor
                                onChange={handleChange}
                                onSubmit={handleSubmit}
                                submitting={submitting}
                                value={value}
                            />
                            }
                        />
                    </div>
                    <div>
                    <List
                        className="comment-list"
                        header={`${data.length} replies`}
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={(item) => (
                        <li>
                            <Comment
                            actions={item.actions}
                            author={item.author}
                            avatar={item.avatar}
                            content={item.content}
                            datetime={item.datetime}
                            />
                        </li>
                        )}
                    />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ModalNews;
