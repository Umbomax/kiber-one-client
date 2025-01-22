import React from 'react';
import { useForm } from 'react-hook-form';

const Checkout = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Оформление заказа</h1>
      <input {...register('lastName')} placeholder="Фамилия" />
      <input {...register('firstName')} placeholder="Имя" />
      <select {...register('schoolAddress')}>
        {/* Список адресов из сервера */}
        <option>Выберите адрес</option>
      </select>
      <input {...register('phone')} placeholder="Телефон" />
      <textarea {...register('additionalInfo')} placeholder="Дополнительная информация" />
      <button type="submit">Оформить заказ</button>
    </form>
  );
};

export default Checkout;
