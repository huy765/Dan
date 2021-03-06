import React, { useEffect, useState, useContext } from "react";
import ReactQuill from "react-quill";
import { modules, formats } from "./Editor/EditorToolbar";
import "react-quill/dist/quill.snow.css";
import "./Editor/style.css";
import { CategoryContext } from "../../../../../Store/Context/CategoryContext";
import { BrandContext } from "../../../../../Store/Context/BrandContext";
import axios from "axios";

import {
    Drawer,
    Tabs,
    Form,
    Col,
    Row,
    Input,
    Select,
    Button,
    InputNumber,
} from "antd";

const { TabPane } = Tabs;

const { Option, OptGroup } = Select;

const ModalUpdateProduct = ({ input, visible, onClose, onUpdate }) => {
    const [state, setState] = useState({ value: input.description });
    const [unit, setUnit] = useState("");
    const [quantitynew, setQuantityNew] = useState(0);
    const [disable, setDisable] = useState(true);
    const [quantityUnit, setQuantityUnit] = useState(1);

    const handleChange = (value) => {
        setState({ value });
    };

    useEffect(() => {
        setState({ value: input.description });
    }, [input]);

    const {
        categoryState: { categorys },
        getCategory,
    } = useContext(CategoryContext);
    useEffect(() => getCategory(), []);

    const {
        brandState: { brands },
        getBrand,
    } = useContext(BrandContext);
    useEffect(() => getBrand(), []);

    const onFinish = (values) => {
        const productUpdate = {
            id: input.id,
            nameProduct: values.nameProduct,
            description: state.value,
            warranty: values.warranty,
            quantity: values.quantity + quantitynew,
            promotional: values.discount,
            price: values.price,
            status: values.state,
            nameCategory: values.category,
            nameBrand: values.brand,
            nameOrigin: values.origin,
        };
        onUpdate(productUpdate);
    };

    const handChangeQuantityUniti = (e) => {
        setQuantityUnit(e.target.value);
    };

    const handChangeQuantity = (e) => {
        if (disable == true) {
            setQuantityNew(e.target.value * 1);
        }
        if (disable == false) {
            setQuantityNew(e.target.value * quantityUnit);
        }
    };

    const onChangeUnit = (e) => {
        setUnit(e);
        if (e === "1") {
            setDisable(true);
        }
        if (e === "2") {
            setDisable(false);
        }
    };
    return (
        <>
            <Drawer
                destroyOnClose
                title={input.fullname}
                visible={visible}
                width={1100}
                onClose={onClose}
            >
                <Form
                    layout='vertical'
                    hideRequiredMark
                    onFinish={onFinish}
                    initialValues={{
                        ["nameProduct"]: input.nameProduct,
                        ["warranty"]: input.warranty + " Th??ng",
                        ["quantity"]: input.quantity,
                        ["price"]: input.price,
                        ["discount"]: input.promotional,
                        ["state"]: input.status,
                        ["category"]: input.nameCategory,
                        ["uniti"]: input.nameUnit,
                        ["brand"]: input.nameManufacturer,
                        ["origin"]: input.nameOrigin,
                        ["quantityUniti"]: "1",
                        ["unitSL"]: "1",
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label='T??n s???n ph???m'
                                name='nameProduct'
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "T??n s???n ph???m kh??ng ???????c ????? tr???ng",
                                    },
                                ]}
                            >
                                <Input
                                    //   defaultValue={stateInput.nameProduct}
                                    placeholder='T??n s???n ph???m'
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label='Gi?? s???n ph???m'
                                name='price'
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Gi?? s???n ph???m kh??ng ???????c ????? tr???ng",
                                    },
                                ]}
                            >
                                <Input placeholder='Gi?? s???n ph???m' allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name='discount' label='Gi???m gi?? (%)'>
                                <InputNumber
                                    min={1}
                                    max={100}
                                    style={{ height: 39 }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item
                                name='category'
                                label='Ch???n danh m???c s???n ph???m'
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "B???n ch??a ch???n danh m???c s???n ph???m",
                                    },
                                ]}
                            >
                                <Select>
                                    {categorys.map((item, index) => {
                                        return (
                                            <Select.Option
                                                key={item.nameCategory}
                                                value={item.nameCategory}
                                            >
                                                {item.nameCategory}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name='warranty'
                                label='Th???i gian b???o h??nh'
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "B???n ch??a ch???n danh m???c s???n ph???m",
                                    },
                                ]}
                            >
                                <Select>
                                    <OptGroup label='Th???i gian b???o h??nh'>
                                        <Option value='1'>1 th??ng</Option>
                                        <Option value='6'>6 th??ng</Option>
                                        <Option value='12'>12 th??ng</Option>
                                    </OptGroup>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name='brand'
                                label='Ch???n th????ng hi???u s???n ph???m'
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "B???n ch??a ch???n th????ng hi???u s???n ph???m",
                                    },
                                ]}
                            >
                                <Select>
                                    {brands.map((item, index) => {
                                        return (
                                            <Select.Option
                                                key={item.nameManufacturer}
                                                value={item.nameManufacturer}
                                            >
                                                {item.nameManufacturer}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name='origin'
                                label='Xu???t x???'
                                rules={[
                                    {
                                        required: true,
                                        message: "B???n ch??a ch???n xu???t x???",
                                    },
                                ]}
                            >
                                <Select>
                                    <OptGroup label='Xu???t x???'>
                                        <Option value='Vi???t Nam'>
                                            Vi???t Nam
                                        </Option>
                                        <Option value='Trung Qu???c'>
                                            Trung Qu???c
                                        </Option>
                                    </OptGroup>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={7}>
                            <Form.Item
                                name='uniti'
                                label='Ch???n ????n v??? t??nh'
                                rules={[
                                    {
                                        required: true,
                                        message: "B???n ch??a ch???n ????n v??? t??nh",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: 250 }}
                                    onChange={onChangeUnit}
                                >
                                    <OptGroup label='????n v??? t??nh'>
                                        <Option value='1'>Chi???c</Option>
                                        <Option value='2'>Th??ng</Option>
                                    </OptGroup>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item name='quantityUniti' label='S??? l?????ng'>
                                <Input
                                    disabled={disable}
                                    allowClear
                                    onChange={handChangeQuantityUniti}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={5}>
                            <Form.Item
                                name='unitSL'
                                label='S??? l?????ng / ????n v???'
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "S??? l?????ng / ????n v??? kh??ng d?????c ????? tr???ng",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder='00000000000000'
                                    allowClear
                                    onChange={handChangeQuantity}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                name='quantitynew'
                                label='S??? l?????ng s???n ph???m m???i nh???p'
                            >
                                <Input
                                    placeholder={quantitynew}
                                    disabled
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name='quantity'
                                label='S??? l?????ng s???n ph???m trong kho'
                            >
                                <Input allowClear disabled={true} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name='quantityupdate'
                                label='S??? l?????ng m???i'
                            >
                                <Input
                                    placeholder={quantitynew + input.quantity}
                                    allowClear
                                    disabled={true}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name='state'
                                label='Tr???ng th??i'
                                width={600}
                            >
                                <Select style={{ width: 250 }}>
                                    <OptGroup label='Tr???ng th??i'>
                                        <Option value='C??n h??ng'>
                                            C??n h??ng
                                        </Option>
                                        <Option value='H???t h??ng'>
                                            H???t h??ng
                                        </Option>
                                    </OptGroup>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Form.Item
                            style={{ marginLeft: "8px" }}
                            name='description'
                            label='M?? t???'
                        >
                            <div className='addNew__container'>
                                {/* <EditorToolbar /> */}
                                <ReactQuill
                                    style={{ minHeight: 500 }}
                                    theme='snow'
                                    value={state.value}
                                    onChange={handleChange}
                                    placeholder={
                                        "Nh???p n???i dung s???n ph???m t???i ????y..."
                                    }
                                    modules={modules}
                                    formats={formats}
                                />
                            </div>
                        </Form.Item>
                    </Row>

                    <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                        <Button type='primary' htmlType='submit'>
                            C???p nh???t
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
};

export default ModalUpdateProduct;
